import { GridGenerator } from 'react-hexgrid'
import { gameUnits } from './startingUnits'

export function makePrePlacedHexagonMap(mapSize) {
  const boardHexes = GridGenerator.hexagon(mapSize).reduce(fillHexInfo, {})
  const hexCountWidth = 1 + 2 * mapSize
  const hexCountHeight = 1 + 2 * mapSize
  const startZones = makeStartZones(boardHexes, mapSize)
  const boardHexesWithPrePlacedUnits = withPrePlaceUnits(boardHexes, startZones)
  return {
    boardHexes: boardHexesWithPrePlacedUnits,
    startZones,
    hexMap: {
      mapShape: 'hexagon',
      mapSize,
      hexCountWidth,
      hexCountHeight,
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
export function makeHexagonMap(mapSize) {
  const boardHexes = GridGenerator.hexagon(mapSize).reduce(fillHexInfo, {})
  const hexCountWidth = 1 + 2 * mapSize
  const hexCountHeight = 1 + 2 * mapSize
  const startZones = makeStartZones(boardHexes, mapSize)
  return {
    boardHexes,
    startZones,
    hexMap: {
      mapShape: 'hexagon',
      mapSize,
      hexCountWidth,
      hexCountHeight,
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
function fillHexInfo(prev, curr) {
  const fullHex = {
    ...curr,
    id: `q${curr.q}r${curr.r}s${curr.s}`,
    occupyingUnitID: '',
    terrain: 'grass',
  }
  return {
    ...prev,
    [fullHex.id]: fullHex,
  }
}
function makeStartZones(boardHexes, mapSize) {
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
function withPrePlaceUnits(hexes, zones) {
  const allUnits = Object.values(gameUnits)
  allUnits.forEach((unit) => {
    // Pick random-ish hex from valid start zone for unit
    const { playerID } = unit
    let randomHex
    // But splitting 2 players with pop & shift looks nice and symmetrical on this map :)
    if (playerID === '0') {
      randomHex = zones[unit.playerID].pop()
    }
    if (playerID === '1') {
      randomHex = zones[unit.playerID].shift()
    }
    // Assign the occupying unit's ID on the boardHex
    hexes[randomHex].occupyingUnitID = unit.unitID
  })
  return hexes
}
