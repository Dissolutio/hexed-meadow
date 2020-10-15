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
  const movingUnitID = unit?.unitID
  const startHex = getBoardHexForUnit(unit, boardHexes)
  initialMoveRange.denied.push(`${startHex.id}`)
  const initialEngagements = getUnitHexEngagements(
    startHex,
    playerID,
    boardHexes,
    gameUnits
  )
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
    const prevEngagements = getUnitHexEngagements(
      startHex,
      playerID,
      boardHexes,
      gameUnits
    )
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
        const endEngagements = getUnitHexEngagements(
          end,
          playerID,
          boardHexes,
          gameUnits
        )
        const isEndHexOccupied = Boolean(endHexUnitID)
        const isTooCostly = movePointsLeftAfterMove < 0
        const isEndHexEnemyOccupied =
          isEndHexOccupied && endHexUnitPlayerID !== playerID
        const isEndHexFriendlyOccupied = Boolean(
          endHexUnitID && endHexUnitPlayerID === playerID
        )
        const isFriendlyHexEngaged = Boolean(
          getUnitHexEngagements(end, playerID, boardHexes, gameUnits).length
        )
        const isUnpassable = isTooCostly || isEndHexEnemyOccupied
        const isInitialDisengaging = initialEngagements.some((id) => {
          return !endEngagements.includes(id) && id !== movingUnitID
        })
        const isPrevDisengaging = prevEngagements.some(
          (id) => !endEngagements.includes(id) && id !== movingUnitID
        )
        const isInitialEngaging = endEngagements.some(
          (id) => !initialEngagements.includes(id) && id !== movingUnitID
        )
        const isPrevEngaging = endEngagements.some(
          (id) => !prevEngagements.includes(id) && id !== movingUnitID
        )
        const wasPreviousInitialEngaging = prevEngagements.some((id) => {
          return !initialEngagements.includes(id) && id !== movingUnitID
        })

        if (isUnpassable || isEndHexFriendlyOccupied) {
          result.denied.push(endHexID)
        } else {
          // Not unpassable or occupied, then can be moved to
          if (
            ((isInitialDisengaging || isPrevDisengaging) &&
              !result.safe.includes(endHexID)) ||
            (isPrevDisengaging && wasPreviousInitialEngaging)
          ) {
            result.disengage.push(endHexID)
          } else if (
            (isPrevEngaging || isInitialEngaging) &&
            !result.safe.includes(endHexID)
          ) {
            result.engage.push(endHexID)
            // result.disengage = result.disengage.filter((id) => id !== endHexID)
          } else {
            result.safe.push(endHexID)
            result.disengage = result.disengage.filter((id) => id !== endHexID)
            result.engage = result.engage.filter((id) => id !== endHexID)
          }
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
export function getMoveRangeExperimental(
  unit: GameUnit,
  boardHexes: BoardHexes,
  gameUnits: GameUnits
) {
  const initialMovePoints = unit.movePoints
  const startHex = getBoardHexForUnit(unit, boardHexes)
  const startHexID = startHex.id
  //🛠 reached / frontier
  const reachedIDs = [startHex.id]
  let frontier = [
    { id: startHexID, cameFrom: startHex.id, movePoints: initialMovePoints },
  ]
  let moveRange = makeBlankMoveRange()

  while (frontier.length > 0) {
    // pick one off frontier
    const current = frontier.shift()
    const currentID = current.id
    const currentHex = { ...boardHexes[current.id] }
    const currentMovePoints = current.movePoints
    if (currentMovePoints < 0) {
      continue
    }
    // expand its neighbors
    const neighbors = getNeighbors(currentHex, boardHexes)
    // unreached neighbors get added to queue (frontier) and to master list (reachedIDs)
    neighbors.forEach((neighbor) => {
      const isInFrontier = frontier.find((h) => h.id === neighbor.id)
      const isInReached = reachedIDs.includes(neighbor.id)

      if (!isInReached) {
        const cameFrom = currentID
        const horizontalMoveCost = 1
        const heightCost = Math.max(neighbor.altitude - currentHex.altitude, 0)
        const newMovePoints =
          currentMovePoints - horizontalMoveCost - heightCost
        const frontierHex = {
          id: neighbor.id,
          cameFrom,
          movePoints: newMovePoints,
        }
        frontier.push(frontierHex)
        reachedIDs.push(neighbor.id)
      }
    })
    // sort current
    if (current.movePoints < 0) {
      continue
    } else {
      moveRange.safe.push(current.id)
    }
  }
  return moveRange
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
  const distanceCost = end.horizontalMoveCost
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
  return gameCardID ? getGameCardByID(armyCards, gameCardID) : null
}

export function getUnrevealedGameCard(
  playerOrderMarkers: { [order: string]: string },
  armyCards: GameArmyCard[],
  currentOrderMarker: number
) {
  const id = playerOrderMarkers[currentOrderMarker.toString()]
  return id ? getGameCardByID(armyCards, id) : null
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