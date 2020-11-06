import { HexUtils } from 'react-hexgrid'

import {
  GameArmyCard,
  GameUnits,
  GameUnit,
  MoveRange,
  makeBlankMoveRange,
} from './startingUnits'
import { BoardHexes, BoardHex, makeHexID } from './mapGen'
import { OrderMarkers, OrderMarker, PlayerOrderMarkers } from './constants'
import { cloneObject, deduplicateMoveRange } from './utilities'

export function getBoardHexForUnit(unit: GameUnit, boardHexes: BoardHexes) {
  if (!(unit && unit?.unitID)) {
    return undefined
  }
  const boardHex = {
    ...Object.values(boardHexes).find(
      (hex) => hex.occupyingUnitID === unit?.unitID
    ),
  }
  return boardHex
}
export function getUnitForBoardHex(hex: BoardHex, gameUnits: GameUnits) {
  const unitID = hex.occupyingUnitID
  const unit = gameUnits?.[unitID]
  return unit
}

export function getGameCardByID(armyCards: GameArmyCard[], gameCardID: string) {
  return armyCards.find((card: GameArmyCard) => card.gameCardID === gameCardID)
}

export function getUnitByID(unitID: string, gameUnits: GameUnits) {
  return gameUnits?.[unitID]
}

export function getMoveRangeForUnit(
  unit: GameUnit,
  boardHexes: BoardHexes,
  gameUnits: GameUnits
): MoveRange {
  const initialMoveRange = makeBlankMoveRange()
  //*early out
  if (!unit) {
    return initialMoveRange
  }
  const playerID = unit?.playerID
  const initialMovePoints = unit?.movePoints ?? 0
  const startHex = getBoardHexForUnit(unit, boardHexes)
  initialMoveRange.denied.push(`${startHex.id}`)
  //*early out again?
  if (!startHex || !initialMovePoints) {
    return initialMoveRange
  }
  const moveRange = {
    ...moveRangeReduce(
      startHex,
      initialMovePoints,
      boardHexes,
      initialMoveRange,
      gameUnits
    ),
  }
  return moveRange

  //* recursive reduce
  function moveRangeReduce(
    startHex: BoardHex,
    movePoints: number,
    boardHexes: BoardHexes,
    initialMoveRange: MoveRange,
    gameUnits: GameUnits
  ): MoveRange {
    const neighbors = getNeighbors(startHex, boardHexes)
    //*early out
    if (movePoints <= 0) {
      return initialMoveRange
    }
    let nextResults = neighbors.reduce(
      (result: MoveRange, end: BoardHex): MoveRange => {
        const endHexID = end.id
        const endHexUnitID = end.occupyingUnitID
        const endHexUnit = { ...gameUnits[endHexUnitID] }
        const endHexUnitPlayerID = endHexUnit.playerID
        const moveCost = getMoveCostToNeighbor(startHex, end)
        const movePointsLeftAfterMove = movePoints - moveCost
        const isEndHexOccupied = Boolean(endHexUnitID)
        const isTooCostly = movePointsLeftAfterMove < 0
        const isEndHexEnemyOccupied =
          isEndHexOccupied && endHexUnitPlayerID !== playerID
        const isEndHexFriendlyOccupied = Boolean(
          endHexUnitID && endHexUnitPlayerID === playerID
        )
        const isUnpassable = isTooCostly || isEndHexEnemyOccupied

        if (isUnpassable || isEndHexFriendlyOccupied) {
          result.denied.push(endHexID)
        } else {
          // Not unpassable or occupied, then can be moved to
          result.safe.push(endHexID)
        }

        if (!isUnpassable) {
          const recursiveMoveRange = moveRangeReduce(
            end,
            movePointsLeftAfterMove,
            boardHexes,
            deduplicateMoveRange(result),
            gameUnits
          )
          return {
            ...deduplicateMoveRange(result),
            ...recursiveMoveRange,
          }
        }
        return result
      },
      // accumulator for reduce fn
      initialMoveRange
    )
    return nextResults
  }
}

export function getNeighbors(
  startHex: BoardHex,
  boardHexes: BoardHexes
): BoardHex[] {
  return HexUtils.neighbours(startHex)
    .map((hex) => {
      const id = makeHexID(hex)
      const exists = Object.keys(boardHexes).includes(id)
      return exists ? { ...boardHexes[makeHexID(hex)] } : null
    })
    .filter((item) => Boolean(item))
}

export function getMoveCostToNeighbor(
  startHex: BoardHex,
  end: BoardHex
): number {
  const altitudeDelta = end.altitude - startHex.altitude
  const heightCost = Math.max(altitudeDelta, 0)
  const distanceCost = 1
  const totalCost = heightCost + distanceCost
  return totalCost
}

export function getUnitsForCard(
  gameCard: GameArmyCard,
  gameUnits: GameUnits
): GameUnit[] {
  const gameCardID = gameCard.gameCardID
  const gameUnitsClone: GameUnits = cloneObject(gameUnits)
  return (
    Object.values(gameUnitsClone)
      .filter((u) => u.gameCardID === gameCardID)
      // deproxy array
      .map((u) => ({ ...u }))
  )
}

export function getRevealedGameCard(
  orderMarkers: OrderMarkers,
  armyCards: GameArmyCard[],
  currentOrderMarker: number,
  currentPlayer: string
) {
  const orderMarker = orderMarkers[currentPlayer].find(
    (om: OrderMarker) => om.order === currentOrderMarker.toString()
  )
  const gameCardID = orderMarker?.gameCardID ?? ''
  return getGameCardByID(armyCards, gameCardID)
}

export function getUnrevealedGameCard(
  playerOrderMarkers: { [order: string]: string },
  armyCards: GameArmyCard[],
  currentOrderMarker: number
) {
  const id = playerOrderMarkers[currentOrderMarker.toString()]
  return getGameCardByID(armyCards, id)
}

export function getUnitHexEngagements(
  hex: BoardHex,
  playerID: string,
  boardHexes: BoardHexes,
  gameUnits: GameUnits
) {
  const adjacentUnitIDs = getNeighbors(hex, boardHexes)
    .filter((h) => h.occupyingUnitID)
    .map((h) => h.occupyingUnitID)
  const engagedUnitIDs = adjacentUnitIDs.filter(
    (id) => gameUnits[id].playerID !== playerID
  )
  return engagedUnitIDs
}

export function getThisTurnData(
  playerOrderMarkers: PlayerOrderMarkers,
  currentOrderMarker: number,
  armyCards: GameArmyCard[],
  gameUnits: GameUnits
) {
  const thisTurnGameCard = {
    ...getUnrevealedGameCard(playerOrderMarkers, armyCards, currentOrderMarker),
  }
  const thisTurnUnits = [...getUnitsForCard(thisTurnGameCard, gameUnits)]
  return { thisTurnGameCard, thisTurnUnits }
}
