import {
  GridGenerator,
  Hex,
  // , HexUtils
} from 'react-hexgrid'
import { gameUnits } from './startingUnits'
import { getRandomInt } from './utilities'

export interface BoardHex {
  id: string
  q: number
  r: number
  s: number
  occupyingUnitID: string
  terrain: string
  altitude: number
  horizontalMoveCost: number
}
export interface BoardHexes {
  [key: string]: BoardHex
}
type StartZone = string[]
export interface StartZones {
  [key: string]: StartZone
}
export type HexMap = {
  mapShape: string
  mapSize: number
  hexGridLayout: string
  hexHeight: number
  hexWidth: number
}

export function makeHexagonShapedMap(mapSize: number, isDevMode: boolean) {
  const hexMap = {
    mapShape: 'hexagon',
    mapSize,
    // FLAT TOP
    hexGridLayout: 'flat',
    hexHeight: Math.round(Math.sqrt(3) * 100) / 100,
    hexWidth: 2,
    // POINTY TOP
    // hexGridLayout: 'pointy',
    // hexHeight: 2,
    // hexWidth: Math.sqrt(3),
  }
  const startZones: StartZones = makeStartZones(
    makeHexagonShapedMapBoardHexes(mapSize),
    mapSize
  )
  const devModeStartZones: StartZones = makeStartZones(
    makeHexagonShapedMapBoardHexes(mapSize),
    mapSize
  )
  const boardHexesWithPrePlacedUnits: BoardHexes = withPrePlaceUnits(
    makeHexagonShapedMapBoardHexes(mapSize),
    devModeStartZones
  )
  return {
    boardHexes: isDevMode
      ? boardHexesWithPrePlacedUnits
      : makeHexagonShapedMapBoardHexes(mapSize),
    startZones: isDevMode ? devModeStartZones : startZones,
    hexMap,
  }
}

export const makeHexID = (hex: Hex) => {
  return `${hex.q},${hex.r},${hex.s}`
}
const fillHexInfo = (prev: BoardHexes, curr: Hex): BoardHexes => {
  const altitude = () => getRandomInt(1, 1)
  const horizontalMoveCost = () => getRandomInt(1, 1)
  const boardHex = {
    ...curr,
    id: makeHexID(curr),
    occupyingUnitID: '',
    terrain: 'grass',
    altitude: altitude(),
    horizontalMoveCost: horizontalMoveCost(),
  }
  return {
    ...prev,
    [boardHex.id]: boardHex,
  }
}
function convertHexgridHexesToBoardHexes(hexgridHexes: Hex[]) {
  return hexgridHexes.reduce(fillHexInfo, {})
}
function makeHexagonShapedMapBoardHexes(mapSize): BoardHexes {
  const hexgridHexes = GridGenerator.hexagon(mapSize)
  //
  //! THIS WORKS! Uncomment so see the map widen up a couple more hexes!
  // const bigMapAddition = [
  //   ...hexgridHexes,
  //   ...hexgridHexes.map((h) => HexUtils.add(h, { q: 1, r: 0, s: -1 })),
  //   ...hexgridHexes.map((h) => HexUtils.add(h, { q: -1, r: 0, s: 1 })),
  // ]
  // const boardHexes = convertHexgridHexesToBoardHexes(bigMapAddition)
  //
  const boardHexes = convertHexgridHexesToBoardHexes(hexgridHexes)
  return boardHexes
}
function makeStartZones(boardHexes: BoardHexes, mapSize: number): StartZones {
  const boardHexesArr = Object.values(boardHexes)
  const P0StartZone = boardHexesArr
    .filter((hex) => hex.s >= Math.max(mapSize - 1, 1))
    .map((hex) => hex.id)
  const P1StartZone = boardHexesArr
    .filter((hex) => hex.s <= -1 * Math.max(mapSize - 1, 1))
    .map((hex) => hex.id)
  return {
    '0': P0StartZone,
    '1': P1StartZone,
  }
}
function withPrePlaceUnits(hexes: BoardHexes, zones: StartZones): BoardHexes {
  const allUnits = Object.values(gameUnits)
  allUnits.forEach((unit) => {
    // Pick random-ish hex from valid start zone for unit
    const { playerID } = unit
    let randomHexID: string
    // But splitting 2 players with pop & shift looks nice and symmetrical on this map :)
    if (playerID === '0') {
      randomHexID = zones[unit.playerID].pop()
    }
    if (playerID === '1') {
      randomHexID = zones[unit.playerID].pop()
    }
    // Assign the occupying unit's ID on the boardHex
    hexes[randomHexID].occupyingUnitID = unit.unitID
  })
  return hexes
}
