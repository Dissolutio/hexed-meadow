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
    mainGame: {
      start: true,
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'placingArmies' })
        console.log('GAME BEGINS')
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
