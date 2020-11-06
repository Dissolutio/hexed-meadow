import React, { createContext, useContext, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import { phaseNames, stageNames } from 'game/constants'
import { GameState } from 'game/game'

type ContextProps = {
  G: GameState
  ctx: BoardProps['ctx']
  moves: Function[]
  playerID: string
}

const BoardContext = createContext(null)

const BoardContextProvider = (props) => {
  //🛠 PROPS
  const { G, ctx, moves, playerID } = props
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
    undo: props.undo,
    redo: props.redo,
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
    <BoardContext.Provider value={boardState}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  return useContext(BoardContext)
}

export { BoardContextProvider, useBoardContext }
