import { TurnOrder, PlayerView } from 'boardgame.io/core'
import { makeHexagonMap, makePrePlacedHexagonMap } from './mapGen'
import { gameUnits, armyCards } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import { initialPlayerState, prePlacedOrderMarkers } from './playerState'
import { phaseNames } from './constants'

/*
// TOGGLE DEV MODE
const isDevMode = false
*/
const isDevMode = true

const map = isDevMode ? makePrePlacedHexagonMap(2) : makeHexagonMap(1)
const players = isDevMode ? prePlacedOrderMarkers : initialPlayerState

const initialGameState = {
  armyCards,
  gameUnits,
  players,
  hexMap: map.hexMap,
  boardHexes: map.boardHexes,
  startZones: map.startZones,
  initiative: null,
  currentRound: 1,
  placementReady: { '0': isDevMode, '1': isDevMode },
  orderMarkersReady: { '0': isDevMode, '1': isDevMode },
  // secret: {},
}

export const HexedMeadow = {
  name: 'HexedMeadow',
  setup: (ctx, setupData) => {
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
      start: isDevMode ? true : false,
      onBegin: (G, ctx) => {
        const initiativeRoll = rollD20Initiative([
          ...Array(ctx.numPlayers).keys(),
        ])
        G.initiative = initiativeRoll
        G.currentOrderMarker = '0'
      },
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
      },
    },
    [phaseNames.placement]: {
      start: isDevMode ? false : true,
      moves: { placeUnitOnHex, confirmPlacementReady },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'placingUnits' })
      },
      endIf: (G) => G.placementReady['0'] && G.placementReady['1'],
      next: phaseNames.placeOrderMarkers,
    },
    [phaseNames.placeOrderMarkers]: {
      onBegin: (G, ctx) => {
        G.players = { ...G.players, ...initialPlayerState }
        ctx.events.setActivePlayers({ all: 'placeOrderMarkers' })
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
