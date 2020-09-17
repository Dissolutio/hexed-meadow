import React, { createContext, useContext, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import { phaseNames, stageNames } from 'game/constants'
import { BoardHex } from 'game/mapGen'
import { GameState } from 'game/game'

interface BoardContextProps extends BoardProps {
  children: React.ReactNode
}
interface BoardContextValue {
  G: GameState
  ctx: BoardProps['ctx']
  moves: { [key: string]: () => void }
  playerID: string
}

const BoardContext = createContext(null)

const BoardContextProvider = (props: BoardContextProps) => {
  // ! UI STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [activeGameCardID, setActiveGameCardID] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const uiState = {
    activeHexID,
    setActiveHexID,
    activeUnitID,
    setActiveUnitID,
    activeGameCardID,
    setActiveGameCardID,
    errorMsg,
    setErrorMsg,
  }

  const { G, ctx, moves, playerID } = props
  // ! MY STATE
  const myState = {
    myCards: G.armyCards.filter(belongsToPlayer),
    myStartZone: G.startZones[playerID],
    myUnits: Object.values(G.gameUnits).filter(belongsToPlayer),
    isMyTurn: ctx.currentPlayer === playerID,
    myCurrentStage: ctx.activePlayers?.[playerID] || '',
    myOrderMarkers: G.players?.[playerID]?.orderMarkers,
  }
  function belongsToPlayer(anything) {
    return anything.playerID === playerID
  }
  // ! SELECTORS
  const getGameCardByID = (gameCardID) => {
    return G.armyCards.find((card) => card.gameCardID === gameCardID)
  }
  const getBoardHexIDForUnitID = (unitID: string) => {
    const boardHexesArr: BoardHex[] = Object.values(G.boardHexes)
    return (
      boardHexesArr.find((boardHex) => {
        return boardHex?.occupyingUnitID === unitID
      })?.id ?? ''
    )
  }
  const activeUnit = G.gameUnits[activeUnitID]
  const currentTurnGameCardID =
    G.players?.[playerID]?.orderMarkers?.[G.currentOrderMarker] ?? ''

  const currentTurnGameCard = G.armyCards.find(
    (armyCard) => armyCard.gameCardID === currentTurnGameCardID
  )
  const selectors = {
    getGameCardByID,
    getBoardHexIDForUnitID,
    activeUnit,
    currentTurnGameCardID,
    currentTurnGameCard,
  }
  // ! PHASE / STAGE INFO
  const isOrderMarkerPhase = ctx.phase === phaseNames.placeOrderMarkers
  const isPlacementPhase = ctx.phase === phaseNames.placement
  const isRoundOfPlayPhase = ctx.phase === phaseNames.roundOfPlay
  const hasConfirmedRoundOfPlayStart =
    isRoundOfPlayPhase && G.roundOfPlayStartReady[playerID]
  const isTakingTurnStage = myState.myCurrentStage === stageNames.takingTurn
  const isWatchingTurnStage = myState.myCurrentStage === stageNames.watchingTurn
  const phaseStage = {
    isPlacementPhase,
    isOrderMarkerPhase,
    isRoundOfPlayPhase,
    hasConfirmedRoundOfPlayStart,
    isTakingTurnStage,
    isWatchingTurnStage,
  }
  //! FINAL BOARD STATE
  const boardState = {
    playerID,
    ...G,
    ...moves,
    ...ctx,
    // BOARD STATE
    ...uiState,
    // PLAYER STATE
    ...myState,
    // SELECTORS
    ...selectors,
    // PHASES / STAGES
    ...phaseStage,
  }

  return (
    <BoardContext.Provider value={boardState}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  return useContext(BoardContext)
}

export { BoardContextProvider, useBoardContext }
