import { hexedMeadowCards } from './cards'
import { ArmyCard, GameArmyCard, PlayersState } from './types'
import { armyCardsToGameUnits } from './functions'
import {
  generateBlankPlayersState,
  generateBlankOrderMarkers,
} from './constants'
import { makeHexagonShapedMap } from './mapGen'

//! DEV TOGGLES
const isDevMode = true
const mapSize = 3
const devPlayerState: PlayersState = {
  '0': {
    orderMarkers: {
      '0': 'p0_hm101',
      '1': 'p0_hm101',
      '2': 'p0_hm101',
      X: 'p0_hm101',
    },
  },
  '1': {
    orderMarkers: {
      '0': 'p1_hm201',
      '1': 'p1_hm201',
      '2': 'p1_hm201',
      X: 'p1_hm201',
    },
  },
}
//!

const generateBaseGameState = () => {
  return {
    placementReady: { '0': isDevMode, '1': isDevMode },
    currentRound: 0,
    currentOrderMarker: 0,
    orderMarkers: generateBlankOrderMarkers(),
    orderMarkersReady: { '0': isDevMode, '1': isDevMode },
    roundOfPlayStartReady: { '0': isDevMode, '1': isDevMode },
    initiative: [], // play phase turn order
    unitsMoved: [],
    unitsAttacked: [],
    // secret: {},
  }
}

// FOR HEXAGON MAP SCENARIO
export const hexagonMapScenario = () => {
  const rawCardsArr: ArmyCard[] = Object.values(hexedMeadowCards)
  const armyCards: GameArmyCard[] = rawCardsArr.map(fillGameCardInfo)
  const gameUnits = armyCardsToGameUnits(armyCards)
  const hexagonMap = makeHexagonShapedMap(mapSize, isDevMode, gameUnits)
  return {
    ...generateBaseGameState(),
    armyCards,
    gameUnits,
    players: isDevMode ? devPlayerState : generateBlankPlayersState(),
    hexMap: hexagonMap.hexMap,
    boardHexes: hexagonMap.boardHexes,
    startZones: hexagonMap.startZones,
  }
}

// FOR TEST SCENARIO
export const testScenario = () => {
  const rawCardsArr: ArmyCard[] = Object.values(hexedMeadowCards)
  const armyCards: GameArmyCard[] = rawCardsArr
    // filters for only hm101 and hm201 (3 figure common squads)
    .filter((c) => c.cardID.endsWith('01'))
    .map(fillGameCardInfo)
  const gameUnits = armyCardsToGameUnits(armyCards)
  const hexagonMap = makeHexagonShapedMap(mapSize, isDevMode, gameUnits)
  return {
    ...generateBaseGameState(),
    armyCards,
    gameUnits: armyCardsToGameUnits(armyCards),
    players: isDevMode ? devPlayerState : generateBlankPlayersState(),
    hexMap: hexagonMap.hexMap,
    boardHexes: hexagonMap.boardHexes,
    startZones: hexagonMap.startZones,
  }
}

function fillGameCardInfo(card: GameArmyCard): GameArmyCard {
  const isCardABee = card.race === 'bee'
  // give bees to player-0 and butterflies to player-1
  const playerID = isCardABee ? '0' : '1'
  const gameCardID = `p${playerID}_${card.cardID}`
  return {
    ...card,
    playerID,
    cardQuantity: 1,
    gameCardID,
  }
}
