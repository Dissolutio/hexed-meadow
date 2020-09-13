import { TurnOrder, PlayerView } from 'boardgame.io/core'
import {
  makeHexagonMap,
  makePrePlacedHexagonMap,
  BoardHexes,
  HexMap,
} from './mapGen'
import { gameUnits, armyCards, GameArmyCard, GameUnits } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import { initialPlayerState, prePlacedOrderMarkers } from './playerState'
import { phaseNames, stageNames } from './constants'

/*
// TOGGLE DEV MODE
const isDevMode = false
*/
const isDevMode = true

const map = isDevMode ? makePrePlacedHexagonMap(2) : makeHexagonMap(1)
const players = isDevMode ? prePlacedOrderMarkers : initialPlayerState

type G = {
  armyCards: GameArmyCard[]
  gameUnits: GameUnits
  players: typeof players
  hexMap: HexMap
  boardHexes: BoardHexes
  startZones: Boolean
  initiative: Boolean
  currentRound: number
  placementReady: Boolean
  orderMarkersReady: Boolean
  roundOfPlayStartReady: Boolean
}

const initialGameState = {
  armyCards,
  gameUnits,
  players,
  hexMap: map.hexMap,
  boardHexes: map.boardHexes,
  startZones: map.startZones,
  initiative: null,
  currentRound: 0,
  placementReady: { '0': isDevMode, '1': isDevMode },
  orderMarkersReady: { '0': isDevMode, '1': isDevMode },
  roundOfPlayStartReady: { '0': !isDevMode, '1': !isDevMode },
  // secret: {},
}

export const HexedMeadow = {
  name: 'HexedMeadow',
  setup: (ctx) => {
    return {
      ...initialGameState,
    }
  },
  moves: {
    placeUnitOnHex,
  },
  seed: 'random_string',
  phases: {
    [phaseNames.roundOfPlay]: {
      start: isDevMode,
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
      },
      onBegin: (G, ctx) => {
        // const initiativeRoll = ['1', '0']
        const initiativeRoll = rollD20Initiative([
          ...Array(ctx.numPlayers).keys(),
        ])
        G.initiative = initiativeRoll
        G.currentRound += 1
        G.currentOrderMarker = '0'
        // Copy over private player OM state into public state
        G.orderMarkers = Object.keys(G.players).reduce((prev, curr) => {
          return {
            ...prev,
            [curr]: G.players[curr].orderMarkers,
          }
        }, {})
        ctx.events.setActivePlayers(
          isDevMode
            ? {
                all: stageNames.watchingTurn,
                value: {
                  [initiativeRoll[0]]: stageNames.takingTurn,
                },
              }
            : { all: stageNames.revealOrderMarkers }
        )
      },
      moves: {
        confirmRoundOfPlayStartReady,
      },
      stages: {
        [stageNames.revealOrderMarkers]: {},
        [stageNames.watchingTurn]: {},
        [stageNames.takingTurn]: {},
      },
    },
    [phaseNames.placement]: {
      start: !isDevMode,
      moves: { placeUnitOnHex, confirmPlacementReady },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: stageNames.placingUnits })
      },
      endIf: (G) => G.placementReady['0'] && G.placementReady['1'],
      next: phaseNames.placeOrderMarkers,
    },
    [phaseNames.placeOrderMarkers]: {
      onBegin: (G, ctx) => {
        G.players = { ...G.players, ...initialPlayerState }
        ctx.events.setActivePlayers({ all: stageNames.placeOrderMarkers })
      },
      endIf: (G) => G.orderMarkersReady['0'] && G.orderMarkersReady['1'],
      moves: {
        placeOrderMarker,
        confirmOrderMarkersReady,
      },
      next: phaseNames.roundOfPlay,
    },
  },
  endIf: (G, ctx) => {},
  events: {
    endGame: false,
  },
  playerView: PlayerView.STRIP_SECRETS,
}

// **MOVES** !!!!

function placeUnitOnHex(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit?.unitID ?? ''
}
function confirmPlacementReady(G, ctx, { playerID }) {
  G.placementReady[playerID] = true
}
function placeOrderMarker(G, ctx, { playerID, orderMarker, gameCardID }) {
  G.players[playerID].orderMarkers[orderMarker] = gameCardID
}
function confirmOrderMarkersReady(G, ctx, { playerID }) {
  G.orderMarkersReady[playerID] = true
}
function confirmRoundOfPlayStartReady(G, ctx, { playerID }) {
  const isMyTurn = playerID === ctx.currentPlayer
  G.roundOfPlayStartReady[playerID] = true
  ctx.events.setStage(
    isMyTurn ? stageNames.takingTurn : stageNames.watchingTurn
  )
}
function makeNormalUnitMove(G, ctx, {}) {
  // * GET CURRENT CARD from order marker and current player
  // * GET FIGURES from current card
  // * CHECK RULES
  // * CHECK PATHS ARE POSSIBLE (moving thru units, movement point availability, )moves are paths of individual one hex movements
  // * CHECK UNIT EFFECTS TRIGGERED
  // *
  // * check for disengagements
  // * update unit
  // * update boardHex
}
