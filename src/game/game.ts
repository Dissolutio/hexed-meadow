import { TurnOrder, PlayerView } from 'boardgame.io/core'
import { BoardProps } from 'boardgame.io/react'
import { HexUtils } from 'react-hexgrid'

import { rollD20Initiative } from './rollInitiative'
import {
  getBoardHexForUnit,
  // getMoveRangeExperimental,
  // getUnrevealedGameCard,
  getMoveRangeForUnit,
  getThisTurnData,
} from './selectors'
import {
  gameUnits,
  armyCards,
  GameArmyCard,
  GameUnits,
  GameUnit,
  makeBlankMoveRange,
} from './startingUnits'
import {
  makeHexagonShapedMap,
  BoardHexes,
  HexMap,
  StartZones,
  BoardHex,
} from './mapGen'
import {
  phaseNames,
  stageNames,
  OrderMarkers,
  OM_COUNT,
  initialOrderMarkers,
  initialPlayerState,
  devPlayerState,
  OrderMarker,
} from './constants'
import { cloneObject } from './utilities'

//🛠 TOGGLE DEV MODE
//!
const isDevMode = true
//!
// const isDevMode = false
//!
//🛠 TOGGLE DEV MODE

const mapSize = 1
const hexagonMap = makeHexagonShapedMap(mapSize, isDevMode)
const players = isDevMode ? devPlayerState : initialPlayerState

type PlayerStateToggle = {
  [playerID: string]: Boolean
}
export type GameState = {
  armyCards: GameArmyCard[]
  gameUnits: GameUnits
  players: typeof players
  hexMap: HexMap
  boardHexes: BoardHexes
  startZones: StartZones
  orderMarkers: OrderMarkers
  initiative: string[]
  currentRound: number
  currentOrderMarker: number
  placementReady: PlayerStateToggle
  orderMarkersReady: PlayerStateToggle
  roundOfPlayStartReady: PlayerStateToggle
}
const initialGameState: GameState = {
  armyCards,
  gameUnits,
  players,
  hexMap: hexagonMap.hexMap,
  boardHexes: hexagonMap.boardHexes,
  startZones: hexagonMap.startZones,
  initiative: [], // RoundOfPlay turn order
  currentRound: 0,
  currentOrderMarker: 0,
  orderMarkers: initialOrderMarkers,
  placementReady: { '0': isDevMode, '1': isDevMode },
  orderMarkersReady: { '0': isDevMode, '1': isDevMode },
  roundOfPlayStartReady: { '0': isDevMode, '1': isDevMode },
  // secret: {},
}

export const HexedMeadow = {
  name: 'HexedMeadow',
  setup: (_ctx) => {
    return {
      ...initialGameState,
    }
  },
  moves: {
    placeUnitOnHex,
    confirmPlacementReady,
    placeOrderMarker,
    confirmOrderMarkersReady,
    moveAction,
    endCurrentPlayerTurn,
  },
  seed: 'random_string',
  playerView: PlayerView.STRIP_SECRETS,
  phases: {
    //PHASE-PLACEMENT
    [phaseNames.placement]: {
      start: true,
      moves: { placeUnitOnHex, confirmPlacementReady },
      //onBegin
      onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
        ctx.events.setActivePlayers({ all: stageNames.placingUnits })
      },
      //endIf
      endIf: (G) => {
        return G.placementReady['0'] && G.placementReady['1']
      },
      next: phaseNames.placeOrderMarkers,
    },
    //PHASE-ORDER MARKERS
    [phaseNames.placeOrderMarkers]: {
      //onBegin
      onBegin: (G, ctx: BoardProps['ctx']) => {
        //🛠 reset state
        const shouldUseDevModeValue = isDevMode && G.currentRound === 0
        G.orderMarkers = initialOrderMarkers
        G.orderMarkersReady = {
          '0': shouldUseDevModeValue,
          '1': shouldUseDevModeValue,
        }
        //🛠 set player stages
        ctx.events.setActivePlayers({ all: stageNames.placeOrderMarkers })
      },
      //endIf - -all players are ready
      endIf: (G) => {
        return G.orderMarkersReady['0'] && G.orderMarkersReady['1']
      },
      //🎆
      moves: {
        placeOrderMarker,
        confirmOrderMarkersReady,
      },
      next: phaseNames.roundOfPlay,
    },
    //PHASE-ROUND OF PLAY
    [phaseNames.roundOfPlay]: {
      //onBegin
      onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
        //🛠 Setup Unrevealed Order Markers
        G.orderMarkers = Object.keys(G.players).reduce(
          (orderMarkers, playerID) => {
            return {
              ...orderMarkers,
              [playerID]: Object.values(
                G.players[playerID].orderMarkers
              ).map((om) => ({ gameCardID: om, order: '' })),
            }
          },
          {}
        )
        //🛠 Roll Initiative
        const initiativeRoll = rollD20Initiative(['0', '1'])
        G.initiative = initiativeRoll
        G.currentOrderMarker = 0
      },
      //onEnd
      onEnd: (G: GameState, ctx: BoardProps['ctx']) => {
        //🛠 Setup for Next Round
        G.orderMarkersReady = { '0': false, '1': false }
        G.roundOfPlayStartReady = { '0': false, '1': false }
        G.players = { ...G.players, ...initialPlayerState }
        G.currentOrderMarker = 0
        G.currentRound += 1
      },
      //TURN-Round Of Play
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
        //onBegin
        onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
          //🛠 Reveal order marker
          const gameCardID =
            G.players[ctx.currentPlayer].orderMarkers[
              G.currentOrderMarker.toString()
            ]
          const indexToReveal = G.orderMarkers[ctx.currentPlayer].findIndex(
            (om: OrderMarker) => {
              return om.gameCardID === gameCardID && om.order === ''
            }
          )
          if (indexToReveal >= 0) {
            G.orderMarkers[ctx.currentPlayer][
              indexToReveal
            ].order = G.currentOrderMarker.toString()
          }
          //🛠 Assign move points/ranges
          const playersOrderMarkers = G.players[ctx.currentPlayer].orderMarkers
          const { thisTurnGameCard, thisTurnUnits } = getThisTurnData(
            playersOrderMarkers,
            G.currentOrderMarker,
            G.armyCards,
            G.gameUnits
          )
          const movePoints = thisTurnGameCard.move
          let newGameUnits = { ...G.gameUnits }

          //🛠 loop
          thisTurnUnits.length &&
            thisTurnUnits.forEach((unit: GameUnit) => {
              const { unitID } = unit
              //🛠 move points
              const unitWithMovePoints = {
                ...unit,
                movePoints,
              }
              newGameUnits[unitID] = unitWithMovePoints
              //🛠 move range
              const moveRange = getMoveRangeForUnit(
                unitWithMovePoints,
                G.boardHexes,
                newGameUnits
              )
              const unitWithMoveRange = {
                ...unitWithMovePoints,
                moveRange,
              }
              newGameUnits[unitID] = unitWithMoveRange
            })
          //🛠 end loop
          //
          G.gameUnits = newGameUnits
        },
        //onEnd
        onEnd: (G: GameState, ctx: BoardProps['ctx']) => {
          //🛠 reset unit move points and ranges
          Object.keys(G.gameUnits).forEach((uid) => {
            G.gameUnits[uid].movePoints = 0
            G.gameUnits[uid].moveRange = { ...makeBlankMoveRange() }
          })
          //🛠 handle turns & order markers
          const isLastTurn = ctx.playOrderPos === ctx.numPlayers - 1
          const isLastOrderMarker = G.currentOrderMarker >= OM_COUNT - 1
          if (isLastTurn && !isLastOrderMarker) {
            G.currentOrderMarker++
          }
          //🛠 end phase after last turn
          if (isLastTurn && isLastOrderMarker) {
            ctx.events.setPhase(phaseNames.placeOrderMarkers)
          }
        },
      },
    },
  },
  events: {
    endGame: false,
  },
}

//🎆 BGIO MOVES
//phase:___RoundOfPlay
function endCurrentPlayerTurn(G: GameState, ctx: BoardProps['ctx']) {
  ctx.events.endTurn()
}
function moveAction(
  G: GameState,
  ctx: BoardProps['ctx'],
  unit: GameUnit,
  endHex: BoardHex
) {
  const { unitID, movePoints } = unit
  const playersOrderMarkers = G.players[ctx.currentPlayer].orderMarkers
  const endHexID = endHex.id
  const startHex = getBoardHexForUnit(unit, G.boardHexes)
  const startHexID = startHex.id
  const currentMoveRange = getMoveRangeForUnit(unit, G.boardHexes, G.gameUnits)
  const isInSafeMoveRange = currentMoveRange.safe.includes(endHexID)
  const moveCost = HexUtils.distance(startHex, endHex)
  // clone G
  const newBoardHexes: BoardHexes = { ...G.boardHexes }
  const newGameUnits: GameUnits = { ...G.gameUnits }
  // set hex's unit id
  newBoardHexes[startHexID].occupyingUnitID = ''
  newBoardHexes[endHexID].occupyingUnitID = unitID
  // update move points
  const newMovePoints = movePoints - moveCost
  newGameUnits[unitID].movePoints = newMovePoints
  // update move ranges for this turn's units
  const { thisTurnUnits } = getThisTurnData(
    playersOrderMarkers,
    G.currentOrderMarker,
    G.armyCards,
    newGameUnits
  )
  thisTurnUnits.forEach((unit: GameUnit) => {
    const { unitID } = unit
    const moveRange = getMoveRangeForUnit(unit, newBoardHexes, newGameUnits)
    console.log(`unitID`, unitID, `moveRange`, moveRange)
    newGameUnits[unitID].moveRange = moveRange
  })
  //🛠 Make the move
  if (isInSafeMoveRange) {
    G.boardHexes = { ...newBoardHexes }
    G.gameUnits = { ...newGameUnits }
  }
}
//phase:___Placement
function placeUnitOnHex(
  G: GameState,
  ctx: BoardProps['ctx'],
  hexId: string,
  unit: GameUnit
) {
  G.boardHexes[hexId].occupyingUnitID = unit?.unitID ?? ''
}
function confirmPlacementReady(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID }
) {
  G.placementReady[playerID] = true
}
//phase:___PlaceOrderMarkers
function placeOrderMarker(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID, orderMarker, gameCardID }
) {
  G.players[playerID].orderMarkers[orderMarker] = gameCardID
}
function confirmOrderMarkersReady(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID }
) {
  G.orderMarkersReady[playerID] = true
}
