import { TurnOrder, PlayerView, Stage } from 'boardgame.io/core'
import {
  boardHexesWithPrePlacedUnits,
  boardHexes,
  startZones,
  mapSize,
} from './mapGen'
import { gameUnits, armyCards } from './startingUnits'

const initialGameState = {
  // boardHexes: boardHexesWithPrePlacedUnits(),
  boardHexes,
  startZones,
  armyCards,
  gameUnits,
  mapSize,
  ready: { '0': false, '1': false },
}

export const HexedMeadow = {
  name: 'HexedMeadow',
  setup: (ctx, setupData) => {
    return {
      ...initialGameState,
    }
  },
  moves: {
    placeUnit,
  },
  seed: 'random_string',
  phases: {
    placementPhase: {
      start: true,
      moves: { placeUnit, confirmReady },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'placingUnits' })
        console.log('PLACING ARMIES BEGIN')
      },
      endIf: (G) => G.ready['0'] && G.ready['1'],
      next: 'mainGame',
    },
    mainGame: {
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'placeOrderMarkers' })
        console.log('MAIN GAME BEGIN')
      },
    },
  },
  endIf: (G, ctx) => {},
  events: {
    endGame: false,
  },
  playerView: PlayerView.STRIP_SECRETS,
}

function placeUnit(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit.unitID
}
function confirmReady(G, ctx, playerID) {
  G.ready[playerID] = true
}
