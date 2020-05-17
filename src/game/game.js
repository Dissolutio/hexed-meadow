import { TurnOrder, PlayerView, Stage } from 'boardgame.io/core'
import {
  // boardHexesWithPrePlacedUnits,
  boardHexes,
  startZones,
  mapSize,
} from './mapGen'
import { gameUnits, armyCards } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'

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
    placeUnitOnHex,
  },
  seed: 'random_string',
  phases: {
    placementPhase: {
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

function placeUnitOnHex(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit.unitID
}
function confirmReady(G, ctx, playerID) {
  G.ready[playerID] = true
}
function rollInitiative(G, ctx) {
  G.initiative = rollD20Initiative([...Array(ctx.numPlayers).keys()])
}
