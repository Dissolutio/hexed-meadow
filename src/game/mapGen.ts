import { GridGenerator, Hex } from 'react-hexgrid'
import { gameUnits } from './startingUnits'

interface BoardHex extends Hex {
  id: string
  occupyingUnitID: string
  terrain?: string
  altitude?: string
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
  hexGridLayout: 'flat' | 'pointy'
  hexHeight: number
  hexWidth: number
}

export function makePrePlacedHexagonMap(mapSize: number) {
  const boardHexes: BoardHexes = GridGenerator.hexagon(mapSize).reduce(
    fillHexInfo,
    {}
  )
  const startZones: StartZones = makeStartZones(boardHexes, mapSize)
  const boardHexesWithPrePlacedUnits = withPrePlaceUnits(boardHexes, startZones)
  return {
    boardHexes: boardHexesWithPrePlacedUnits,
    startZones,
    hexMap: {
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
    },
  }
}
export function makeHexagonMap(mapSize: number) {
  const boardHexes = GridGenerator.hexagon(mapSize).reduce(fillHexInfo, {})
  const startZones = makeStartZones(boardHexes, mapSize)
  return {
    boardHexes,
    startZones,
    hexMap: {
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
    },
  }
}
const fillHexInfo = (prev: BoardHexes, curr: Hex): BoardHexes => {
  const boardHex = {
    ...curr,
    id: `q${curr.q}r${curr.r}s${curr.s}`,
    occupyingUnitID: '',
    terrain: 'grass',
  }
  return {
    ...prev,
    [boardHex.id]: boardHex,
  }
}
function makeStartZones(boardHexes: BoardHexes, mapSize: number): StartZones {
  const boardHexesArr = Object.values(boardHexes)
  const P0StartZone = boardHexesArr
    .filter((hex) => parseFloat(hex.s) >= Math.max(mapSize - 1, 1))
    .map((hex) => hex.id)
  const P1StartZone = boardHexesArr
    .filter((hex) => parseFloat(hex.s) <= -1 * Math.max(mapSize - 1, 1))
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
      randomHexID = zones[unit.playerID].shift()
    }
    // Assign the occupying unit's ID on the boardHex
    hexes[randomHexID].occupyingUnitID = unit.unitID
  })
  return hexes
}
