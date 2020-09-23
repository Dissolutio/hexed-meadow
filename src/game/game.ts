import { TurnOrder, PlayerView } from 'boardgame.io/core'
import { BoardProps } from 'boardgame.io/react'
import { HexUtils } from 'react-hexgrid'

import {
  gameUnits,
  armyCards,
  GameArmyCard,
  GameUnits,
  GameUnit,
  MoveRange,
  baseMoveRange,
} from './startingUnits'
import { rollD20Initiative } from './rollInitiative'
import {
  makeHexagonMap,
  makePrePlacedHexagonMap,
  BoardHexes,
  BoardHex,
  HexMap,
  StartZones,
  makeHexID,
} from './mapGen'
import {
  phaseNames,
  stageNames,
  OrderMarkers,
  OM_COUNT,
  initialOrderMarkers,
  initialPlayerState,
  devPlayerState,
  OrderMarker,
} from './constants'

/* TOGGLE DEV MODE*/
//
const isDevMode = true
// const isDevMode = false
//
/* TOGGLE DEV MODE */

const map = isDevMode ? makePrePlacedHexagonMap(1) : makeHexagonMap(3)
const players = isDevMode ? devPlayerState : initialPlayerState

type PlayerStateToggle = {
  [playerID: string]: Boolean
}

export type GameState = {
  armyCards: GameArmyCard[]
  gameUnits: GameUnits
  players: typeof players
  hexMap: HexMap
  boardHexes: BoardHexes
  startZones: StartZones
  orderMarkers: OrderMarkers
  initiative: string[]
  currentRound: number
  currentOrderMarker: number
  placementReady: PlayerStateToggle
  orderMarkersReady: PlayerStateToggle
  roundOfPlayStartReady: PlayerStateToggle
}

const initialGameState: GameState = {
  armyCards,
  gameUnits,
  players,
  hexMap: map.hexMap,
  boardHexes: map.boardHexes,
  startZones: map.startZones,
  initiative: [],
  currentRound: 0,
  currentOrderMarker: 0,
  orderMarkers: initialOrderMarkers,
  placementReady: { '0': isDevMode, '1': isDevMode },
  orderMarkersReady: { '0': isDevMode, '1': isDevMode },
  roundOfPlayStartReady: { '0': isDevMode, '1': isDevMode },
  // secret: {},
}

export const HexedMeadow = {
  name: 'HexedMeadow',
  setup: (_ctx) => {
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
    //PHASE-PLACEMENT
    [phaseNames.placement]: {
      start: true,
      moves: { placeUnitOnHex, confirmPlacementReady },
      //onBegin
      onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
        ctx.events.setActivePlayers({ all: stageNames.placingUnits })
      },
      //endIf
      endIf: (G) => {
        return G.placementReady['0'] && G.placementReady['1']
      },
      next: phaseNames.placeOrderMarkers,
    },
    //PHASE-ORDER MARKERS
    [phaseNames.placeOrderMarkers]: {
      //onBegin
      onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
        const shouldUseDevModeValue = isDevMode && G.currentRound === 0
        //! reset state
        G.orderMarkers = initialOrderMarkers
        G.orderMarkersReady = {
          '0': shouldUseDevModeValue,
          '1': shouldUseDevModeValue,
        }
        //! set player stages
        ctx.events.setActivePlayers({ all: stageNames.placeOrderMarkers })
      },
      //endIf
      endIf: (G) => {
        return G.orderMarkersReady['0'] && G.orderMarkersReady['1']
      },
      //🎆
      moves: {
        placeOrderMarker,
        confirmOrderMarkersReady,
      },
      next: phaseNames.roundOfPlay,
    },
    //PHASE-ROUND OF PLAY
    [phaseNames.roundOfPlay]: {
      //onBegin
      onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
        //🛠 Setup Unrevealed Order Markers
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
        //🛠 Roll Initiative
        const initiativeRoll = rollD20Initiative(['0', '1'])
        G.initiative = initiativeRoll
        G.currentOrderMarker = 0
      },
      //onEnd
      onEnd: (G: GameState, ctx: BoardProps['ctx']) => {
        //🛠 Setup for Next Round
        G.orderMarkersReady = { '0': false, '1': false }
        G.roundOfPlayStartReady = { '0': false, '1': false }
        G.players = { ...G.players, ...initialPlayerState }
        G.currentOrderMarker = 0
        G.currentRound += 1
      },
      //TURN-Round Of Play
      turn: {
        order: TurnOrder.CUSTOM_FROM('initiative'),
        //onBegin
        onBegin: (G: GameState, ctx: BoardProps['ctx']) => {
          const thisTurnGameCardID =
            G.players[ctx.currentPlayer].orderMarkers[
              G.currentOrderMarker.toString()
            ]
          const thisTurnGameCard = G.armyCards.find(
            (c) => c.gameCardID === thisTurnGameCardID
          )
          const thisTurnUnits = Object.values(G.gameUnits).filter(
            (u) => u.gameCardID === thisTurnGameCardID
          )
          //🛠 reveal OM
          const indexToReveal = G.orderMarkers[ctx.currentPlayer].findIndex(
            (om: OrderMarker) => {
              return om.gameCardID === thisTurnGameCardID && om.order === ''
            }
          )
          G.orderMarkers[ctx.currentPlayer][
            indexToReveal
          ].order = G.currentOrderMarker.toString()

          //🛠 assign unit values
          thisTurnUnits.forEach((unit: GameUnit) => {
            //* move points
            const movePoints = thisTurnGameCard.move
            G.gameUnits[unit.unitID].movePoints = movePoints
            //* move ranges
            const moveRange = getMoveRangeForUnit(
              { ...unit, movePoints: movePoints },
              G.boardHexes
            )
            G.gameUnits[unit.unitID].moveRange = moveRange
          })
        },
        //onEnd
        onEnd: (G: GameState, ctx: BoardProps['ctx']) => {
          //🛠 reset unit move points and ranges
          Object.keys(G.gameUnits).forEach((uid) => {
            G.gameUnits[uid].movePoints = 0
            G.gameUnits[uid].moveRange = { ...baseMoveRange }
          })
          //🛠 handle turns & order markers
          const isLastTurn = ctx.playOrderPos === ctx.numPlayers - 1
          const isLastOrderMarker = G.currentOrderMarker >= OM_COUNT - 1
          if (isLastTurn && !isLastOrderMarker) {
            G.currentOrderMarker++
          }
          //🛠 end phase after last turn
          if (isLastTurn && isLastOrderMarker) {
            ctx.events.setPhase(phaseNames.placeOrderMarkers)
          }
        },
      },
    },
  },
  events: {
    endGame: false,
  },
}
//🎆MOVES

//phase -- ROUND OF PLAY 🎆

function confirmRoundOfPlayStartReady(G: GameState, ctx: BoardProps['ctx']) {
  G.roundOfPlayStartReady[ctx.playerID] = true
}

function endCurrentPlayerTurn(G: GameState, ctx: BoardProps['ctx']) {
  ctx.events.endTurn()
}
//🎆 move unit
type UnitMove = {
  unitID: string
  endHexID: string
}
function moveAction(G: GameState, ctx: BoardProps['ctx'], move: UnitMove) {
  const { unitID, endHexID } = move
  const movePoints = G.gameUnits[unitID].movePoints
  const startHex = Object.values(G.boardHexes).find(
    (hex) => hex.occupyingUnitID === unitID
  )
  const endHex = G.boardHexes[endHexID]

  const isEndHexOccupied = Boolean(endHex.occupyingUnitID)
  const distance = HexUtils.distance(startHex, endHex)
  const isInMoveRange = distance <= movePoints
  if (isInMoveRange && !isEndHexOccupied) {
    G.boardHexes[startHex.id].occupyingUnitID = ''
    G.boardHexes[endHex.id].occupyingUnitID = unitID
    G.gameUnits[unitID].movePoints -= distance
  }
}

//phase -- PLACEMENT 🎆

function placeUnitOnHex(
  G: GameState,
  ctx: BoardProps['ctx'],
  hexId: string,
  unit
) {
  G.boardHexes[hexId].occupyingUnitID = unit?.unitID ?? ''
}
function confirmPlacementReady(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID }
) {
  G.placementReady[playerID] = true
}

//phase -- ORDER MARKERS 🎆

function placeOrderMarker(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID, orderMarker, gameCardID }
) {
  G.players[playerID].orderMarkers[orderMarker] = gameCardID
}
function confirmOrderMarkersReady(
  G: GameState,
  ctx: BoardProps['ctx'],
  { playerID }
) {
  G.orderMarkersReady[playerID] = true
}

//🛠--UTILITY FUNCTIONS

function getBoardHexForUnit(unit: GameUnit, boardHexes: BoardHexes) {
  return Object.values(boardHexes).find(
    (hex) => hex.occupyingUnitID === unit?.unitID
  )
}

export function getMoveRangeForUnit(
  unit: GameUnit,
  boardHexes: BoardHexes
): MoveRange {
  //
  //🛠 initialize
  const start = getBoardHexForUnit(unit, boardHexes)

  //🛠 moveRange recursive reduce
  const moveRange = moveRangeReduce(start, unit.movePoints, boardHexes)
  return moveRange

  function moveRangeReduce(
    start: BoardHex,
    movePoints: number,
    boardHexes: BoardHexes
  ): MoveRange {
    const startNeighbors = getNeighbors(start, boardHexes)

    return startNeighbors.reduce(
      (result: MoveRange, end: BoardHex) => {
        const { safely, engage, disengage, denied } = result
        const moveCost = getMoveCostToNeighbor(start, end)
        const movePointsLeftAfterMove = movePoints - moveCost

        //🛠 hex already denied
        const allPrev = [safely, engage, disengage, denied].flat()
        const isAlreadyIncluded = allPrev.includes(end.id)
        if (isAlreadyIncluded) {
          return result
        }
        //🛠 deny hex
        const isEndHexOccupied = Boolean(end.occupyingUnitID)
        const isDenied = movePointsLeftAfterMove < 0 || isEndHexOccupied
        if (isDenied) {
          result.denied.push(end.id)
        }
        //🛠 ELSE safe FKN STOOP1d
        if (!isDenied) {
          result.safely.push(end.id)
          if (movePointsLeftAfterMove) {
            const recursiveMoveRange = moveRangeReduce(
              end,
              movePointsLeftAfterMove,
              boardHexes
            )
            return {
              ...result,
              ...recursiveMoveRange,
            }
          }
        }
        return result
      },
      { ...baseMoveRange }
    )
  }
}

function getNeighbors(start: BoardHex, boardHexes: BoardHexes): BoardHex[] {
  return HexUtils.neighbours(start)
    .map((hex) => {
      const id = makeHexID(hex)
      const exists = Object.keys(boardHexes).includes(id)
      return exists ? { ...boardHexes[makeHexID(hex)] } : null
    })
    .filter((item) => Boolean(item))
}

function getMoveCostToNeighbor(start: BoardHex, end: BoardHex): number {
  const altitudeDelta = end.altitude - start.altitude
  const heightCost = Math.max(altitudeDelta, 0)
  const distanceCost = end.horizontalMoveCost
  const totalCost = heightCost + distanceCost
  return totalCost
}
