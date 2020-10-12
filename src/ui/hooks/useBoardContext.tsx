import React, { createContext, useContext, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import { phaseNames } from 'game/constants'
import { BoardHex } from 'game/mapGen'
import { GameArmyCard } from 'game/startingUnits'

interface BoardContextProps extends BoardProps {
  children: React.ReactNode
}

const BoardContext = createContext(null)

const BoardContextProvider = (props: BoardContextProps) => {
  //🛠 PROPS
  const { G, ctx, moves, playerID } = props

  //🛠 utility
  function belongsToPlayer(thing: any) {
    return thing?.playerID === playerID
  }

  //🛠 UI STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [activeGameCardID, setActiveGameCardID] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  //🛠 COMPUTED

  const myCards = G.armyCards.filter(belongsToPlayer)
  const myStartZone = G.startZones[playerID]
  const myUnits = Object.values(G.gameUnits).filter(belongsToPlayer)
  const isMyTurn = ctx.currentPlayer === playerID
  const myCurrentStage = ctx.activePlayers?.[playerID] || ''
  const myOrderMarkers = G.players?.[playerID]?.orderMarkers
  const isOrderMarkerPhase = ctx.phase === phaseNames.placeOrderMarkers
  const isPlacementPhase = ctx.phase === phaseNames.placement
  const isRoundOfPlayPhase = ctx.phase === phaseNames.roundOfPlay

  //🛠 SELECTORS
  const getGameCardByID = (gameCardID: string) => {
    return G.armyCards.find(
      (card: GameArmyCard) => card.gameCardID === gameCardID
    )
  }
  const getGameUnitByID = (unitID: string) => {
    const unit = G.gameUnits?.[unitID]
    return { ...unit }
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
  //TODO: make getUnitForHex(hex)
  function getMapHexUnit(hex: BoardHex) {
    const unitID = hex.occupyingUnitID
    const unit = getGameUnitByID(unitID)
    const isMyUnit = belongsToPlayer(unit)
    // TODO
    // Track placement in Player State (secret state)
    // for now, don't reveal enemy units in Placement phase
    //TODO
    if (isPlacementPhase && !isMyUnit) {
      return null
    }
    return unit
  }

  //🛠 ASSEMBLED BOARDSTATE
  const boardState = {
    playerID,
    ...G,
    ...moves,
    ...ctx,
    undo: props.undo,
    redo: props.redo,
    //🛠 UI STATE
    activeHexID,
    setActiveHexID,
    activeUnitID,
    setActiveUnitID,
    activeGameCardID,
    setActiveGameCardID,
    errorMsg,
    setErrorMsg,

    //🛠 COMPUTED
    myCards,
    myStartZone,
    myUnits,
    isMyTurn,
    myCurrentStage,
    myOrderMarkers,
    isOrderMarkerPhase,
    isPlacementPhase,
    isRoundOfPlayPhase,
    //🛠 SELECTORS
    belongsToPlayer,
    getGameCardByID,
    getGameUnitByID,
    getBoardHexIDForUnitID,
    getMapHexUnit,
    activeUnit,
    currentTurnGameCardID,
    currentTurnGameCard,
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
