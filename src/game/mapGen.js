import { GridGenerator } from 'react-hexgrid';
import { startingUnits, armyCardsInGame } from './startingUnits'

// HEXES MADE BY REACT-HEXGRID => Battlescape Map Hexes :)
export const mapSize = 9
const basicHexes = GridGenerator.hexagon(mapSize)
export const boardHexes = basicHexes.reduce(fillHexInfo, {})

// MAKE SOME STARTZONES FOR 2 PLAYERS ON A SIMPLE MAP
const boardHexesArr = Object.values(boardHexes)
const P0StartHexesArr = boardHexesArr.filter(hex => hex.r >= (mapSize - 2))
const P1StartHexesArr = boardHexesArr.filter(hex => hex.r <= -(mapSize - 2))
const P2StartHexesArr = boardHexesArr.filter(hex => hex.q >= (mapSize - 2))
const P3StartHexesArr = boardHexesArr.filter(hex => hex.q <= -(mapSize - 2))
const P0StartZone = P0StartHexesArr.map(hex => hex.id)
const P1StartZone = P1StartHexesArr.map(hex => hex.id)
const P2StartZone = P0StartHexesArr.map(hex => hex.id)
const P3StartZone = P1StartHexesArr.map(hex => hex.id)
export const startZones = {
  '0': P0StartZone,
  '1': P1StartZone
}

export const boardHexesWithPrePlacedUnits = () => {
  const allUnits = Object.values(startingUnits)
  let boardHexesCopy = { ...boardHexes }
  let startZonesCopy = {
    '0': [...startZones['0']],
    '1': [...startZones['1']]
  }

  allUnits.forEach((unit) => {
    // Pick random-ish hex from valid start zone for unit
    const { playerID } = unit
    let randomHex

    // But splitting 2 players with pop & shift looks nice and symmetrical on this map :)
    if (playerID === '0') {
      randomHex = startZonesCopy[unit.playerID].pop()
    }
    if (playerID === '1') {
      randomHex = startZonesCopy[unit.playerID].shift()
    }

    // Assign the occupying unit's ID on the boardHex
    boardHexesCopy[randomHex].occupyingUnitID = unit.unitID
  })
  return boardHexesCopy
}

export const playerColors = {
  0: 'rgb(3, 64, 120)', // blue #034078
  1: 'rgb(219,219,320)', // red #db2d20
  // 2: 'rgb(219,2,142)',
  // 3: 'rgb(100,345,32)',
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
    [fullHex.id]: fullHex
  }
}