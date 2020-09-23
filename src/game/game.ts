import { TurnOrder, PlayerView } from 'boardgame.io/core'
import { BoardProps } from 'boardgame.io/react'
import { HexUtils } from 'react-hexgrid'

import { gameUnits, armyCards, GameArmyCard, GameUnits } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import {
  makeHexagonMap,
  makePrePlacedHexagonMap,
  BoardHexes,
  HexMap,
  StartZones,
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

/* TOGGLE DEV MODE*/
//
const isDevMode = true
// const isDevMode = false
//
/* TOGGLE DEV MODE */

const map = isDevMode ? makePrePlacedHexagonMap(3) : makeHexagonMap(3)
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
  hexMap: map.hexMap,
  boardHexes: map.boardHexes,
  startZones: map.startZones,
  initiative: [],
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
    confirmRoundOfPlayStartReady,
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
      onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
        const shouldUseDevModeValue = isDevMode && G.currentRound === 0
        //! reset state
        G.orderMarkers = initialOrderMarkers
        G.orderMarkersReady = {
          '0': shouldUseDevModeValue,
          '1': shouldUseDevModeValue,
        }
        //! set player stages
        ctx.events.setActivePlayers({ all: stageNames.placeOrderMarkers })
      },
      //endIf
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
          const thisTurnGameCardID =
            G.players[ctx.currentPlayer].orderMarkers[
              G.currentOrderMarker.toString()
            ]
          const thisTurnGameCard = G.armyCards.find(
            (c) => c.gameCardID === thisTurnGameCardID
          )
          //! reveal OM
          const indexToReveal = G.orderMarkers[ctx.currentPlayer].findIndex(
            (om: OrderMarker) => {
              return om.gameCardID === thisTurnGameCardID && om.order === ''
            }
          )
          G.orderMarkers[ctx.currentPlayer][
            indexToReveal
          ].order = G.currentOrderMarker.toString()
          const thisTurnUnits = Object.values(G.gameUnits).filter(
            (u) => u.gameCardID === thisTurnGameCardID
          )
          //! assign unit values
          thisTurnUnits.forEach((unit) => {
            const movePoints = thisTurnGameCard.move
            G.gameUnits[unit.unitID].movePoints = movePoints
          })
        },
        //onEnd
        onEnd: (G: GameState, ctx: BoardProps['ctx']) => {
          //🛠 reset unit move points and ranges
          const isLastTurn = ctx.playOrderPos === ctx.numPlayers - 1
          const isLastOrderMarker = G.currentOrderMarker >= OM_COUNT - 1
          if (isLastTurn && !isLastOrderMarker) {
            G.currentOrderMarker++
          }
          //! ...and END PHASE
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
//! MOVES
//! round of play
function confirmRoundOfPlayStartReady(G: GameState, ctx: BoardProps['ctx']) {
  G.roundOfPlayStartReady[ctx.playerID] = true
}
function endCurrentPlayerTurn(G: GameState, ctx: BoardProps['ctx']) {
  ctx.events.endTurn()
}
type UnitMove = {
  unitID: string
  endHexID: string
}
function moveAction(G: GameState, ctx: BoardProps['ctx'], move: UnitMove) {
  const { unitID, endHexID } = move
  const movePoints = G.gameUnits[unitID].movePoints
  const startHex = Object.values(G.boardHexes).find(
    (hex) => hex.occupyingUnitID === unitID
  )
  const endHex = G.boardHexes[endHexID]
  const isEndHexOccupied = Boolean(endHex.occupyingUnitID)
  const distance = HexUtils.distance(startHex, endHex)
  const isInMoveRange = distance <= movePoints
  if (isInMoveRange && !isEndHexOccupied) {
    G.boardHexes[startHex.id].occupyingUnitID = ''
    G.boardHexes[endHex.id].occupyingUnitID = unitID
    G.gameUnits[unitID].movePoints -= distance
  }
}
//! placement
function placeUnitOnHex(G: GameState, ctx: BoardProps['ctx'], hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit?.unitID ?? ''
}
function confirmPlacementReady(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID }
) {
  G.placementReady[playerID] = true
}

//! order markers
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
