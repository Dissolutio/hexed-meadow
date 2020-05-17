import { GridGenerator } from 'react-hexgrid'
import { gameUnits } from './startingUnits'

// HEXES MADE BY REACT-HEXGRID => Battlescape Map Hexes :)
export const mapSize = 1
const basicHexes = GridGenerator.hexagon(mapSize)
export const boardHexes = basicHexes.reduce(fillHexInfo, {})

// MAKE SOME STARTZONES FOR 2 PLAYERS ON A SIMPLE MAP
const boardHexesArr = Object.values(boardHexes)
const P0StartHexesArr = boardHexesArr.filter((hex) => hex.r >= mapSize)
const P1StartHexesArr = boardHexesArr.filter((hex) => hex.r <= -mapSize)
// const P2StartHexesArr = boardHexesArr.filter((hex) => hex.q >= mapSize - 2);
// const P3StartHexesArr = boardHexesArr.filter((hex) => hex.q <= -(mapSize - 2));
const P0StartZone = P0StartHexesArr.map((hex) => hex.id)
const P1StartZone = P1StartHexesArr.map((hex) => hex.id)
// const P2StartZone = P0StartHexesArr.map((hex) => hex.id);
// const P3StartZone = P1StartHexesArr.map((hex) => hex.id);
export const startZones = {
  '0': P0StartZone,
  '1': P1StartZone,
}

export const boardHexesWithPrePlacedUnits = () => {
  const allUnits = Object.values(gameUnits)
  let boardHexesCopy = { ...boardHexes }
  let startZonesCopy = {
    '0': [...startZones['0']],
    '1': [...startZones['1']],
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
