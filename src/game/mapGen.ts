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

export function makeHexagonShapedMap(
  mapSize: number,
  isDevMode: boolean,
  flat: boolean = false
) {
  const flatDimensions = {
    hexGridLayout: 'flat',
    hexHeight: Math.round(Math.sqrt(3) * 100) / 100,
    hexWidth: 2,
  }
  const pointyDimensions = {
    hexGridLayout: 'pointy',
    hexHeight: 2,
    hexWidth: Math.sqrt(3),
  }
  const mapDimensions = flat ? flatDimensions : pointyDimensions
  const hexMap = {
    ...mapDimensions,
    mapShape: 'hexagon',
    mapSize,
  }
  const startZones: StartZones = hexagonStartZones(
    generateHexagon(mapSize),
    mapSize
  )
  const devStartZones: StartZones = hexagonStartZones(
    generateHexagon(mapSize),
    mapSize
  )
  const boardHexes: BoardHexes = generateHexagon(mapSize)
  const devBoardHexes: BoardHexes = withPrePlaceUnits(
    generateHexagon(mapSize),
    devStartZones
  )

  return {
    boardHexes: isDevMode ? devBoardHexes : boardHexes,
    startZones: isDevMode ? devStartZones : startZones,
    hexMap,
  }
}

function hexagonStartZones(
  boardHexes: BoardHexes,
  mapSize: number
): StartZones {
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
    const { playerID } = unit
    let randomHexID: string
    if (playerID === '0') {
      randomHexID = zones[unit.playerID].pop()
    }
    if (playerID === '1') {
      randomHexID = zones[unit.playerID].pop()
    }
    // update boardHex
    hexes[randomHexID].occupyingUnitID = unit.unitID
  })
  return hexes
}
// HEX DATA
export const makeHexID = (hex: Hex) => {
  return `${hex.q},${hex.r},${hex.s}`
}
const fillHexInfo = (prev: BoardHexes, curr: Hex): BoardHexes => {
  const boardHex = {
    ...curr,
    id: makeHexID(curr),
    occupyingUnitID: '',
    terrain: 'grass',
    altitude: 1,
  }
  return {
    ...prev,
    [boardHex.id]: boardHex,
  }
}
function convertHexgridHexesToBoardHexes(hexgridHexes: Hex[]) {
  return hexgridHexes.reduce(fillHexInfo, {})
}
// REACT-HEXGRID GENERATORS
function generateHexagon(mapSize): BoardHexes {
  const hexgridHexes = GridGenerator.hexagon(mapSize)
  const boardHexes = convertHexgridHexesToBoardHexes(hexgridHexes)
  return boardHexes
}
function generateOrientedRectangle(mapSize: number): BoardHexes {
  const hexgridHexes = GridGenerator.orientedRectangle(mapSize, mapSize)
  const boardHexes = convertHexgridHexesToBoardHexes(hexgridHexes)
  return boardHexes
}
function generateRectangle(mapSize: number): BoardHexes {
  const hexgridHexes = GridGenerator.rectangle(mapSize + 1, mapSize + 1)
  const boardHexes = convertHexgridHexesToBoardHexes(hexgridHexes)
  return boardHexes
}
function generateParallelogram(mapSize: number): BoardHexes {
  const hexgridHexes = GridGenerator.parallelogram(
    -mapSize - 2,
    mapSize + 2,
    -mapSize,
    mapSize
  )
  const boardHexes = convertHexgridHexesToBoardHexes(hexgridHexes)
  return boardHexes
}
