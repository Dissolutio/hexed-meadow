import { TurnOrder, PlayerView, Stage } from 'boardgame.io/core';
import {
  boardHexesWithPrePlacedUnits,
  boardHexes,
  startZones,
  mapSize,
} from './mapGen'
import { startingUnits, armyCardsInGame } from './startingUnits'

const initialGameState = {
  // boardHexes: boardHexesWithPrePlacedUnits(),
  boardHexes,
  startZones,
  armyCardsInGame,
  startingUnits,
  mapSize,
}

export const HexedMeadow = {
  name: 'HexedMeadow',
  setup: (ctx, setupData) => {
    return {
      ...initialGameState
    }
  },
  moves: {
    myMove: (G, ctx) => { },
  }
}