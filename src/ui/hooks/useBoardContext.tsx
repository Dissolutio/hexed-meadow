import React, { createContext, useContext, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import { PlayerOrderMarkers } from 'game/constants'
import { GameState } from 'game/game'
import { phaseNames, stageNames } from 'game/constants'
import { GameArmyCard, GameUnit } from 'game/startingUnits'

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
  const belongsToPlayer = (thing: any): boolean => thing?.playerID === playerID
  const activeUnit: GameUnit = G.gameUnits[activeUnitID]
  const myCards: GameArmyCard[] = G.armyCards.filter(belongsToPlayer)
  const myStartZone: string[] = G.startZones[playerID]
  const myUnits: GameUnit[] = Object.values(G.gameUnits).filter(belongsToPlayer)
  const myOrderMarkers: PlayerOrderMarkers = G.players?.[playerID]?.orderMarkers
  const isMyTurn: boolean = ctx.currentPlayer === playerID
  const isOrderMarkerPhase: boolean = ctx.phase === phaseNames.placeOrderMarkers
  const isPlacementPhase: boolean = ctx.phase === phaseNames.placement
  const isRoundOfPlayPhase: boolean = ctx.phase === phaseNames.roundOfPlay
  const isAttackingStage: boolean =
    isRoundOfPlayPhase && ctx.activePlayers?.[playerID] === stageNames.attacking
  const isGameover: boolean = Boolean(ctx.gameover)

  //🛠 ASSEMBLED BOARDSTATE
  const boardState = {
    playerID,
    G,
    moves,
    ctx,
    undo: undo,
    redo: redo,
    //STATE
    activeHexID,
    setActiveHexID,
    activeUnitID,
    setActiveUnitID,
    activeUnit,
    activeGameCardID,
    setActiveGameCardID,
    errorMsg,
    setErrorMsg,
    //COMPUTED
    belongsToPlayer,
    myCards,
    myStartZone,
    myUnits,
    isMyTurn,
    myOrderMarkers,
    isOrderMarkerPhase,
    isPlacementPhase,
    isRoundOfPlayPhase,
    isAttackingStage,
    isGameover,
  }

  return (
    <BoardContext.Provider value={boardState}>{children}</BoardContext.Provider>
  )
}

const useBoardContext = () => {
  return useContext(BoardContext)
}

export { BoardContextProvider, useBoardContext }
