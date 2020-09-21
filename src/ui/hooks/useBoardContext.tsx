import React, { createContext, useContext, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import { phaseNames, stageNames } from 'game/constants'
import { BoardHex } from 'game/mapGen'
import { GameUnit, GameArmyCard } from 'game/startingUnits'

interface BoardContextProps extends BoardProps {
  children: React.ReactNode
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

  // ! SELECTORS

  function belongsToPlayer(anything) {
    return anything.playerID === playerID
  }
  const getGameCardByID = (gameCardID: string) => {
    return G.armyCards.find(
      (card: GameArmyCard) => card.gameCardID === gameCardID
    )
  }
  const getGameUnitByID = (unitID: string) => {
    const gameUnitsArr = Object.values(G.gameUnits)
    return gameUnitsArr.find((unit: GameUnit) => unit.unitID === unitID)
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
    belongsToPlayer,
    getGameCardByID,
    getGameUnitByID,
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
  const phaseStage = {
    isPlacementPhase,
    isOrderMarkerPhase,
    isRoundOfPlayPhase,
    hasConfirmedRoundOfPlayStart,
  }
  //! FINAL BOARD STATE
  const boardState = {
    playerID,
    ...G,
    ...moves,
    ...ctx,
    undo: props.undo,
    redo: props.redo,
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
