import { TurnOrder, PlayerView } from 'boardgame.io/core'
import {
  makeHexagonMap,
  makePrePlacedHexagonMap,
  BoardHexes,
  HexMap,
  StartZones,
} from './mapGen'
import { gameUnits, armyCards, GameArmyCard, GameUnits } from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import {
  phaseNames,
  stageNames,
  OrderMarkers,
  OM_COUNT,
  initialPlayerState,
  devPlayerState,
} from './constants'

/*
// {} TOGGLE DEV MODE
const isDevMode = false
*/
const isDevMode = true

const map = isDevMode ? makePrePlacedHexagonMap(2) : makeHexagonMap(3)
const players = isDevMode ? devPlayerState : initialPlayerState

type G = {
  armyCards: GameArmyCard[]
  gameUnits: GameUnits
  hexMap: HexMap
  boardHexes: BoardHexes
  startZones: StartZones

  players: typeof players
  initiative: Boolean
  orderMarkers: OrderMarkers
  currentRound: number
  currentOrderMarker: number

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
  currentOrderMarker: 0,
  orderMarkers: devPlayerState,
  placementReady: { '0': isDevMode, '1': isDevMode },
  orderMarkersReady: { '0': isDevMode, '1': isDevMode },
  roundOfPlayStartReady: { '0': isDevMode, '1': isDevMode },
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
    // ! PLACEMENT PHASE
    [phaseNames.placement]: {
      start: true,
      moves: { placeUnitOnHex, confirmPlacementReady },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: stageNames.placingUnits })
      },
      endIf: (G) => {
        return G.placementReady['0'] && G.placementReady['1']
      },
      next: phaseNames.placeOrderMarkers,
    },
    // ! ORDER MARKERS PHASE
    [phaseNames.placeOrderMarkers]: {
      onBegin: (G, ctx) => {
        G.currentRound += 1
        ctx.events.setActivePlayers({ all: stageNames.placeOrderMarkers })
      },
      endIf: (G) => {
        return G.orderMarkersReady['0'] && G.orderMarkersReady['1']
      },
      moves: {
        placeOrderMarker,
        confirmOrderMarkersReady,
      },
      next: phaseNames.roundOfPlay,
    },
    // ! ROUND OF PLAY PHASE
    [phaseNames.roundOfPlay]: {
      // endIf: (G, ctx) => G.currentOrderMarker >= ctx.numPlayers * OM_COUNT,
      onBegin: (G, ctx) => {
        // TODO - generate this player IDs arr
        const initiativeRoll = rollD20Initiative(['0', '1'])
        G.initiative = initiativeRoll
        G.currentOrderMarker = 0
        // ADD UNREVEALED ORDER MARKER STATE FROM PLAYER STATE
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
      },
      onEnd: (G, ctx) => {
        G.orderMarkersReady = { '0': false, '1': false }
        G.roundOfPlayStartReady = { '0': false, '1': false }
        G.players = { ...G.players, ...initialPlayerState }
        G.currentOrderMarker = 0
      },
      moves: {
        confirmRoundOfPlayStartReady,
        endCurrentPlayerTurn,
      },
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
        onBegin: (G, ctx) => {
          // REVEAL OM
          const gameCardID =
            G.players[ctx.currentPlayer].orderMarkers[
              G.currentOrderMarker.toString()
            ]
          const isRevealableOM = (om) => {
            return om.gameCardID === gameCardID && om.order === ''
          }
          const index = G.orderMarkers[ctx.currentPlayer].findIndex((om) =>
            isRevealableOM(om)
          )
          if (index >= 0) {
            G.orderMarkers[ctx.currentPlayer][
              index
            ].order = G.currentOrderMarker.toString()
          }

          ctx.events.setActivePlayers({
            currentPlayer: stageNames.takingTurn,
            others: stageNames.watchingTurn,
          })
        },
        onEnd: (G, ctx) => {
          // HANDLE TURNS & ORDER MARKERS
          const isLastTurn = ctx.playOrderPos === ctx.numPlayers - 1
          const isLastOrderMarker = G.currentOrderMarker >= OM_COUNT - 1
          if (isLastTurn && !isLastOrderMarker) {
            G.currentOrderMarker++
          }
          if (isLastTurn && isLastOrderMarker) {
            ctx.events.setPhase(phaseNames.placeOrderMarkers)
          }
        },
      },
      stages: {
        [stageNames.watchingTurn]: {},
        [stageNames.takingTurn]: {
          moves: {
            confirmRoundOfPlayStartReady,
            moveAction,
            endCurrentPlayerTurn,
          },
        },
      },
    },
  },
  events: {
    endGame: false,
  },
}
// !! MOVES
// round of play
function confirmRoundOfPlayStartReady(G, ctx, { playerID }) {
  const isMyTurn = playerID === ctx.currentPlayer
  G.roundOfPlayStartReady[playerID] = true
  ctx.events.setStage(
    isMyTurn ? stageNames.takingTurn : stageNames.watchingTurn
  )
}
function endCurrentPlayerTurn(G, ctx) {
  ctx.events.endTurn()
}
type UnitMove = {
  unitID: string
  startHex: string
  endHex: string
}
function moveAction(G, ctx, move: UnitMove) {
  // G.boardHexes
  // * GAMECARD => FIGURES
  // * GET FIGURES from current card
  // * CHECK PATHS  (thru units, movement points, height changes)
  // *
  // * check for disengagements
  // * update unit
  // * update boardHex
}
// placement
function placeUnitOnHex(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit?.unitID ?? ''
}
function confirmPlacementReady(G, ctx, { playerID }) {
  G.placementReady[playerID] = true
}

// order markers
function placeOrderMarker(G, ctx, { playerID, orderMarker, gameCardID }) {
  G.players[playerID].orderMarkers[orderMarker] = gameCardID
}
function confirmOrderMarkersReady(G, ctx, { playerID }) {
  G.orderMarkersReady[playerID] = true
}
