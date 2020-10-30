import { TurnOrder, PlayerView } from 'boardgame.io/core'
import { BoardProps } from 'boardgame.io/react'
import { HexUtils } from 'react-hexgrid'

import { rollD20Initiative } from './rollInitiative'
import {
  getBoardHexForUnit,
  getGameCardByID,
  // getUnrevealedGameCard,
  getMoveRangeForUnit,
  getThisTurnData,
} from './selectors'
import {
  gameUnits,
  armyCards,
  GameArmyCard,
  GameUnits,
  GameUnit,
  makeBlankMoveRange,
} from './startingUnits'
import {
  makeHexagonShapedMap,
  BoardHexes,
  HexMap,
  StartZones,
  BoardHex,
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
import { cloneObject } from './utilities'

let isDevMode = true
//! TOGGLE DEV MODE HERE
// isDevMode = false
//!
if (process.env.NODE_ENV === 'production') {
  isDevMode = false
}

const mapSize = 1
const hexagonMap = makeHexagonShapedMap(mapSize, isDevMode)
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
  unitsMoved: string[]
  unitsAttacked: string[]
}
const initialGameState: GameState = {
  armyCards,
  gameUnits,
  players,
  hexMap: hexagonMap.hexMap,
  boardHexes: hexagonMap.boardHexes,
  startZones: hexagonMap.startZones,
  initiative: [], // RoundOfPlay turn order
  currentRound: 0,
  currentOrderMarker: 0,
  orderMarkers: initialOrderMarkers,
  placementReady: { '0': isDevMode, '1': isDevMode },
  orderMarkersReady: { '0': isDevMode, '1': isDevMode },
  roundOfPlayStartReady: { '0': isDevMode, '1': isDevMode },
  unitsMoved: [],
  unitsAttacked: [],
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
    moveAction,
    attackAction,
    endCurrentPlayerTurn,
    endCurrentMoveStage,
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
      onBegin: (G, ctx: BoardProps['ctx']) => {
        //🛠 reset state
        const shouldUseDevModeValue = isDevMode && G.currentRound === 0
        G.orderMarkers = initialOrderMarkers
        G.orderMarkersReady = {
          '0': shouldUseDevModeValue,
          '1': shouldUseDevModeValue,
        }
        //🛠 set player stages
        ctx.events.setActivePlayers({ all: stageNames.placeOrderMarkers })
      },
      //endIf - -all players are ready
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
          // Reveal order marker
          const gameCardID =
            G.players[ctx.currentPlayer].orderMarkers[
              G.currentOrderMarker.toString()
            ]
          const indexToReveal = G.orderMarkers[ctx.currentPlayer].findIndex(
            (om: OrderMarker) => {
              return om.gameCardID === gameCardID && om.order === ''
            }
          )
          if (indexToReveal >= 0) {
            G.orderMarkers[ctx.currentPlayer][
              indexToReveal
            ].order = G.currentOrderMarker.toString()
          }
          // Assign move points/ranges
          const playersOrderMarkers = G.players[ctx.currentPlayer].orderMarkers
          const { thisTurnGameCard, thisTurnUnits } = getThisTurnData(
            playersOrderMarkers,
            G.currentOrderMarker,
            G.armyCards,
            G.gameUnits
          )
          const movePoints = thisTurnGameCard.move
          let newGameUnits = { ...G.gameUnits }

          //🛠 loop thru this turns units
          thisTurnUnits.length &&
            thisTurnUnits.forEach((unit: GameUnit) => {
              const { unitID } = unit
              // move points
              const unitWithMovePoints = {
                ...unit,
                movePoints,
              }
              newGameUnits[unitID] = unitWithMovePoints
              // move range
              const moveRange = getMoveRangeForUnit(
                unitWithMovePoints,
                G.boardHexes,
                newGameUnits
              )
              const unitWithMoveRange = {
                ...unitWithMovePoints,
                moveRange,
              }
              newGameUnits[unitID] = unitWithMoveRange
            })
          //🛠 end loop

          //🛠 update G
          G.gameUnits = newGameUnits
          G.unitsMoved = []
          G.unitsAttacked = []
        },
        //onEnd
        onEnd: (G: GameState, ctx: BoardProps['ctx']) => {
          //🛠 reset unit move points and ranges
          Object.keys(G.gameUnits).forEach((uid) => {
            G.gameUnits[uid].movePoints = 0
            G.gameUnits[uid].moveRange = { ...makeBlankMoveRange() }
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
  // The minimum and maximum number of players supported
  // (This is only enforced when using the Lobby server component.)
  minPlayers: 2,
  maxPlayers: 2,
  // Ends the game if this returns anything.
  // The return value is available in `ctx.gameover`.
  endIf: (G, ctx) => {
    const gameUnitsArr = Object.values(G.gameUnits)
    const isP0Dead = !gameUnitsArr.some((u: GameUnit) => u.playerID === '0')
    const isP1Dead = !gameUnitsArr.some((u: GameUnit) => u.playerID === '1')
    if (isP0Dead) {
      return { winner: '1' }
    } else if (isP1Dead) {
      return { winner: '0' }
    } else {
      return false
    }
  },
  // Called at the end of the game.
  // `ctx.gameover` is available at this point.
  onEnd: (G, ctx) => {
    const winner = ctx.gameover.winner === '0' ? 'BEES' : 'BUTTERFLIES'
    console.log(`THE ${winner} WON!`)
  },
}

//🎆 BGIO MOVES
//phase:___RoundOfPlay
function endCurrentMoveStage(G: GameState, ctx: BoardProps['ctx']) {
  ctx.events.setStage(stageNames.attacking)
}
function endCurrentPlayerTurn(G: GameState, ctx: BoardProps['ctx']) {
  ctx.events.endTurn()
}
function moveAction(
  G: GameState,
  ctx: BoardProps['ctx'],
  unit: GameUnit,
  endHex: BoardHex
) {
  const { unitID, movePoints } = unit
  const playersOrderMarkers = G.players[ctx.currentPlayer].orderMarkers
  const endHexID = endHex.id
  const startHex = getBoardHexForUnit(unit, G.boardHexes)
  const startHexID = startHex.id
  const currentMoveRange = getMoveRangeForUnit(unit, G.boardHexes, G.gameUnits)
  const isInSafeMoveRange = currentMoveRange.safe.includes(endHexID)
  const moveCost = HexUtils.distance(startHex, endHex)
  // clone G
  const newBoardHexes: BoardHexes = { ...G.boardHexes }
  const newGameUnits: GameUnits = { ...G.gameUnits }
  // update moved units counter
  const unitsMoved = [...G.unitsMoved]
  if (!unitsMoved.includes(unitID)) {
    unitsMoved.push(unitID)
    G.unitsMoved = unitsMoved
  }
  // update unit position
  newBoardHexes[startHexID].occupyingUnitID = ''
  newBoardHexes[endHexID].occupyingUnitID = unitID
  // update unit move points
  const newMovePoints = movePoints - moveCost
  newGameUnits[unitID].movePoints = newMovePoints
  // update move ranges for this turn's units
  const { thisTurnUnits } = getThisTurnData(
    playersOrderMarkers,
    G.currentOrderMarker,
    G.armyCards,
    newGameUnits
  )
  thisTurnUnits.forEach((unit: GameUnit) => {
    const { unitID } = unit
    const moveRange = getMoveRangeForUnit(unit, newBoardHexes, newGameUnits)
    newGameUnits[unitID].moveRange = moveRange
  })
  //🛠 Make the move
  if (isInSafeMoveRange) {
    G.boardHexes = { ...newBoardHexes }
    G.gameUnits = { ...newGameUnits }
  }
}
function attackAction(
  G: GameState,
  ctx: BoardProps['ctx'],
  unit: GameUnit,
  defenderHex: BoardHex
) {
  const { unitID } = unit
  const unitGameCard = getGameCardByID(G.armyCards, unit.gameCardID)
  const unitRange = unitGameCard.range
  const unitsMoved = [...G.unitsMoved]
  const unitsAttacked = [...G.unitsAttacked]
  const attacksAllowed = unitGameCard.figures
  const attacksLeft = attacksAllowed - unitsAttacked.length
  const attackerHex = getBoardHexForUnit(unit, G.boardHexes)

  //! EARLY OUTS
  // DISALLOW - no target
  if (!defenderHex.occupyingUnitID) {
    console.log(`no target`)
    return
  }
  // DISALLOW - all attacks used
  const isEndAttacks = attacksLeft <= 0
  if (isEndAttacks) {
    console.log(`all attacks used`)
    return
  }
  // DISALLOW - unit already attacked
  const isAlreadyAttacked = unitsAttacked.includes(unitID)
  if (isAlreadyAttacked) {
    console.log(`unit already attacked`)
    return
  }
  // DISALLOW - attack must be used by a moved unit
  const isMovedUnit = unitsMoved.includes(unitID)
  const isOpenAttack = attacksLeft > unitsMoved.length
  const isUsableAttack = isMovedUnit || isOpenAttack
  if (!isUsableAttack) {
    console.log(`attack must be used by a moved unit`)
    return
  }
  // DISALLOW - defender is out of range
  const isInRange = HexUtils.distance(attackerHex, defenderHex) <= unitRange
  if (!isInRange) {
    console.log(`defender is out of range`)
    return
  }

  //🛠 ALLOW
  const attack = unitGameCard.attack
  const defenderGameUnit = G.gameUnits[defenderHex.occupyingUnitID]
  const defenderGameCard = getGameCardByID(
    G.armyCards,
    defenderGameUnit.gameCardID
  )
  const defense = defenderGameCard.defense
  const defenderLife = defenderGameCard.life
  const attackRoll = ctx.random.Die(6, attack)
  const skulls = attackRoll.filter((n) => n <= 3).length
  const defenseRoll = ctx.random.Die(6, defense)
  const shields = defenseRoll.filter((n) => n === 4 || n === 5).length
  const wounds = skulls - shields
  const isHit = wounds > 0
  const isFatal = wounds >= defenderLife
  console.log(`A:`, skulls, `D:`, shields, `wounds:`, wounds)

  // deal damage
  if (isHit && !isFatal) {
    G.armyCards[defenderGameUnit.gameCardID].life = defenderLife - wounds
  }
  if (isFatal) {
    delete G.gameUnits[defenderGameUnit.unitID]
    G.boardHexes[defenderHex.id].occupyingUnitID = ''
  }
  // update units attacked
  unitsAttacked.push(unitID)
  G.unitsAttacked = unitsAttacked
}
//phase:___Placement
function placeUnitOnHex(
  G: GameState,
  ctx: BoardProps['ctx'],
  hexId: string,
  unit: GameUnit
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
//phase:___PlaceOrderMarkers
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
