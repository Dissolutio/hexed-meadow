import { TurnOrder, PlayerView } from 'boardgame.io/core'
import { makeHexagonMap, makePrePlacedHexagonMap } from './mapGen'
import { gameUnits, armyCards } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import { initialPlayerState, prePlacedOrderMarkers } from './playerState'
import { placeUnitOnHex, confirmReady, placeOrderMarker } from './moves'
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
    roundOfPlay: {
      start: isDevMode ? true : false,
      onBegin: (G, ctx) => {
        const initiativeRoll = rollD20Initiative([
          ...Array(ctx.numPlayers).keys(),
        ])
        const firstPlayerID = initiativeRoll[0]
        const firstPlayersFirstOrderMarkerGameCardID =
          G.players[firstPlayerID].orderMarkers['0']

        G.initiative = initiativeRoll
        G.currentOrderMarker = G.currentTurnGameCardID = armyCards.find(
          (armyCard) => {
            return (
              armyCard.gameCardID === firstPlayersFirstOrderMarkerGameCardID
            )
          }
        ).gameCardID
      },
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
      },
    },
    placement: {
      start: isDevMode ? false : true,
      moves: { placeUnitOnHex, confirmReady },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'placingUnits' })
      },
      endIf: (G) => G.placementReady['0'] && G.placementReady['1'],
      next: phaseNames.placeOrderMarkers,
    },
    placeOrderMarkers: {
      onBegin: (G, ctx) => {
        G.players = { ...G.players, ...initialPlayerState }
        ctx.events.setActivePlayers({ all: 'placeOrderMarkers' })
      },
      endIf: (G) => G.orderMarkersReady['0'] && G.orderMarkersReady['1'],
      moves: {
        placeOrderMarker,
        confirmReady,
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
