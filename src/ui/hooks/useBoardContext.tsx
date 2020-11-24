import React, {
  createContext,
  ReactChildren,
  useContext,
  useState,
} from 'react'
import { BoardProps } from 'boardgame.io/react'
import { PlayerOrderMarkers } from 'game/constants'
import { GameState } from 'game/game'
import { phaseNames, stageNames } from 'game/constants'
import { GameArmyCard, GameUnit } from 'game/startingUnits'

const BoardContext = createContext<Partial<BoardContextValue>>({})

export type BoardContextProps = {
  G: GameState
  playerID: string
  ctx: BoardProps['ctx']
  moves: BoardProps['moves']
  undo: BoardProps['undo']
  redo: BoardProps['redo']
  children?: React.ReactChild
}

export type BoardContextValue = BoardContextProps & {
  // state
  activeHexID: string
  setActiveHexID: React.Dispatch<React.SetStateAction<string>>
  selectedUnitID: string
  setSelectedUnitID: React.Dispatch<React.SetStateAction<string>>
  selectedGameCardID: string
  setSelectedGameCardID: React.Dispatch<React.SetStateAction<string>>
  errorMsg: string
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
  // computed
  belongsToPlayer: (thing: any) => boolean
  activeUnit: GameUnit
  myCards: GameArmyCard[]
  myStartZone: string[]
  myUnits: GameUnit[]
  myOrderMarkers: PlayerOrderMarkers
  isMyTurn: boolean
  isOrderMarkerPhase: boolean
  isPlacementPhase: boolean
  isRoundOfPlayPhase: boolean
  isAttackingStage: boolean
  isGameover: boolean
}

const BoardContextProvider = (props: BoardContextProps) => {
  //🛠 PROPS
  const { G, ctx, moves, playerID, undo, redo, children } = props
  //🛠 STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [selectedUnitID, setSelectedUnitID] = useState('')
  const [selectedGameCardID, setSelectedGameCardID] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  //🛠 COMPUTED
  const belongsToPlayer = (thing: any): boolean => thing?.playerID === playerID
  const activeUnit: GameUnit = G.gameUnits[selectedUnitID]
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
    selectedUnitID,
    setSelectedUnitID,
    selectedGameCardID,
    setSelectedGameCardID,
    errorMsg,
    setErrorMsg,
    //COMPUTED
    activeUnit,
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
