import { TurnOrder, PlayerView, Stage } from 'boardgame.io/core'
import {
  boardHexesWithPrePlacedUnits,
  boardHexes,
  startZones,
  mapSize,
} from './mapGen'
import { gameUnits, armyCards } from './startingUnits'

import { placeUnitOnHex, confirmReady, rollInitiative } from './moves'

const initialGameState = {
  // boardHexes: boardHexesWithPrePlacedUnits(),
  boardHexes,
  startZones,
  armyCards,
  gameUnits,
  mapSize,
  ready: { '0': false, '1': false },
  initiative: {},
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
        console.log('PLACING ARMIES BEGIN')
      },
      endIf: (G) => G.ready['0'] && G.ready['1'],
      next: 'mainGame',
    },
    mainGame: {
      onBegin: (G, ctx) => {
        G.ready = initialGameState.ready
        ctx.events.setActivePlayers({ all: 'placeOrderMarkers' })
      },
      turn: {
        stages: {
          placeOrderMarkers: {
            moves: {
              confirmReady,
            },
          },
        },
      },
      order: TurnOrder.CUSTOM_FROM('initiative'),
    },
  },
  endIf: (G, ctx) => {},
  events: {
    endGame: false,
  },
  playerView: PlayerView.STRIP_SECRETS,
}
