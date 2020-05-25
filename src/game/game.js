import { TurnOrder, PlayerView, ActivePlayers, Stage } from 'boardgame.io/core'
import { makeHexagonShapedMap } from './mapGen'
import { gameUnits, armyCards } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import { initialPlayerState, prePlacedOrderMarkers } from './playerState'
import {
  placeUnitOnHex,
  confirmReady,
  placeOrderMarker,
  flipOrderMarker,
} from './moves'

const map = makeHexagonShapedMap(2)

const initialGameState = {
  boardHexes: map.boardHexes,
  // boardHexes: map.boardHexesWithPrePlacedUnits,
  startZones: map.startZones,
  armyCards,
  gameUnits,
  hexMap: map.hexMap,
  placementReady: { '0': false, '1': false },
  orderMarkersReady: { '0': false, '1': false },
  initiativeReady: { '0': false, '1': false },
  orderMarker1Ready: { '0': false, '1': false },
  initiative: null,
  // players: initialPlayerState,
  players: prePlacedOrderMarkers,
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
    placement: {
      start: true,
      moves: { placeUnitOnHex, confirmReady },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'placingUnits' })
      },
      endIf: (G) => G.placementReady['0'] && G.placementReady['1'],
      next: 'placeOrderMarkers',
    },
    placeOrderMarkers: {
      onBegin: (G, ctx) => {
        G.ready = { '0': false, '1': false }
        G.players = initialPlayerState
        ctx.events.setActivePlayers({ all: 'placeOrderMarkers' })
        console.log('%c⧭', 'color: #eeff00', G.ready)
      },
      endIf: (G) => G.orderMarkersReady['0'] && G.orderMarkersReady['1'],
      moves: {
        placeOrderMarker,
        confirmReady,
      },
      next: 'rollingInitiative',
    },
    rollingInitiative: {
      moves: { confirmReady },
      onBegin: (G, ctx) => {
        G.ready = initialGameState.ready
        G.initiative = rollD20Initiative([...Array(ctx.numPlayers).keys()])
        ctx.events.setActivePlayers({ all: 'rollingInitiative' })
      },
      endIf: (G) => G.initiativeReady['0'] && G.initiativeReady['1'],
      next: 'orderMarker1',
    },
    // ACTUALLY TAKING A TURN
    orderMarker1: {
      moves: { flipOrderMarker },
      onBegin: (G, ctx) => {
        if (G.initiative === null) {
          G.initiative = rollD20Initiative([...Array(ctx.numPlayers).keys()])
        }
        const key = ctx.currentPlayer
        ctx.events.setActivePlayers({ [key]: 'moving1' })
      },
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
      },
    },
  },
  endIf: (G, ctx) => {},
  events: {
    endGame: false,
  },
  playerView: PlayerView.STRIP_SECRETS,
}
