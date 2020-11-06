import React, { createContext, useContext, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'

import { GameState } from 'game/game'
import { getRevealedGameCard } from 'game/selectors'
import { phaseNames, stageNames } from 'game/constants'

const BoardContext = createContext(null)

export type BoardContextProps = {
  G: GameState
  playerID: string
  ctx: BoardProps['ctx']
  moves: BoardProps['moves']
  undo: BoardProps['undo']
  redo: BoardProps['redo']
}

const BoardContextProvider: React.FC<BoardContextProps> = (props) => {

  //🛠 PROPS
  const { G, ctx, moves, playerID, undo, redo, children } = props
  //🛠 STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [activeGameCardID, setActiveGameCardID] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  //🛠 COMPUTED

  function belongsToPlayer(thing: any) {
    return thing?.playerID === playerID
  }
  const myCards = G.armyCards.filter(belongsToPlayer)
  const myStartZone = G.startZones[playerID]
  const myUnits = Object.values(G.gameUnits).filter(belongsToPlayer)
  const isMyTurn = ctx.currentPlayer === playerID
  const myCurrentStage = ctx.activePlayers?.[playerID] || ''
  const myOrderMarkers = G.players?.[playerID]?.orderMarkers
  const isOrderMarkerPhase = ctx.phase === phaseNames.placeOrderMarkers
  const isPlacementPhase = ctx.phase === phaseNames.placement
  const isRoundOfPlayPhase = ctx.phase === phaseNames.roundOfPlay
  const isAttackingStage =
    isRoundOfPlayPhase && ctx.activePlayers?.[playerID] === stageNames.attacking
  const isGameover = Boolean(ctx.gameover)
  //🛠 SELECTORS
  const activeUnit = G.gameUnits[activeUnitID]
  const currentTurnGameCardID =
    G.players?.[playerID]?.orderMarkers?.[G.currentOrderMarker] ?? ''
  const currentTurnGameCard = G.armyCards.find(
    (armyCard) => armyCard.gameCardID === currentTurnGameCardID
  )

  //🛠 ASSEMBLED BOARDSTATE
  const boardState = {
    playerID,
    G,
    moves,
    ctx,
    undo: undo,
    redo: redo,
    //🛠 UI STATE
    activeHexID,
    setActiveHexID,
    activeUnitID,
    setActiveUnitID,
    activeUnit,
    activeGameCardID,
    setActiveGameCardID,
    errorMsg,
    setErrorMsg,

    //🛠 COMPUTED
    belongsToPlayer,
    myCards,
    myStartZone,
    myUnits,
    isMyTurn,
    myCurrentStage,
    myOrderMarkers,
    isOrderMarkerPhase,
    isPlacementPhase,
    isRoundOfPlayPhase,
    isAttackingStage,
    isGameover,
    //🛠 SELECTORS
    currentTurnGameCardID,
    currentTurnGameCard,
  }

  return (
    <BoardContext.Provider value={boardState}>{children}</BoardContext.Provider>
  )
}

const useBoardContext = () => {
  return useContext(BoardContext)
}

export { BoardContextProvider, useBoardContext }
