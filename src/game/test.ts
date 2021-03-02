import { hexedMeadowCards } from './cards'
import {
  ArmyCard,
  GameArmyCard,
  MapOptions,
  OrderMarkers,
  PlayersState,
  PlayerStateToggle,
} from './types'
import { armyCardsToGameUnits } from './functions'
import {
  generateBlankPlayersState,
  generateBlankOrderMarkers,
} from './constants'
import { makeHexagonShapedMap } from './mapGen'

const playersStateWithPrePlacedOMs: PlayersState = {
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
type DevGameOptions = BaseGameOptions &
  MapOptions & {
    withPrePlacedUnits?: boolean
  }
type BaseGameOptions =
  | {
      placementReady?: PlayerStateToggle
      orderMarkersReady?: PlayerStateToggle
      roundOfPlayStartReady?: PlayerStateToggle
      currentRound?: number
      currentOrderMarker?: number
      orderMarkers?: OrderMarkers
      initiative?: string[]
      unitsMoved?: string[]
      unitsAttacked?: string[]
      players?: PlayersState
    }
  | undefined

// placementReady: { '0': true, '1': true },
// orderMarkersReady: { '0': true, '1': true },
// roundOfPlayStartReady: { '0': true, '1': true },
const generateBaseGameState = (devOptions?: BaseGameOptions) => {
  const defaultDevOptions = {
    withPrePlacedUnits: false,
    placementReady: { '0': false, '1': false },
    orderMarkersReady: { '0': false, '1': false },
    roundOfPlayStartReady: { '0': false, '1': false },
    currentRound: 0,
    currentOrderMarker: 0,
    orderMarkers: generateBlankOrderMarkers(),
    initiative: [],
    unitsMoved: [],
    unitsAttacked: [],
    players: generateBlankPlayersState(),
  }

  return {
    ...defaultDevOptions,
    ...devOptions,
  }
}

// FOR HEXAGON MAP SCENARIO
export const hexagonMapScenario = (devOptions?: DevGameOptions) => {
  // GET CORE CARDS
  const hexedMeadowCardsArr: ArmyCard[] = Object.values(hexedMeadowCards)
  // MAKE CARDS TO GAMECARDS
  const armyCards: GameArmyCard[] = hexedMeadowCardsArr.map(fillGameCardInfo)
  // MAKE GAMECARDS TO GAMEUNITS
  // todo this could use some params, so some units can be pre-dead
  const gameUnits = armyCardsToGameUnits(armyCards)
  // MAKE MAP
  const hexagonMap = makeHexagonShapedMap({
    mapSize: 3,
    withPrePlacedUnits: true,
    gameUnits,
  })
  return {
    ...generateBaseGameState(devOptions),
    armyCards,
    gameUnits,
    hexMap: hexagonMap.hexMap,
    boardHexes: hexagonMap.boardHexes,
    startZones: hexagonMap.startZones,
  }
}

//!! TEST SCENARIO
export const testScenario = () =>
  makeTestScenario({
    mapSize: 2,
    withPrePlacedUnits: false,
  })
// !!...and how its made
const makeTestScenario = (devOptions?: DevGameOptions) => {
  const { withPrePlacedUnits, mapSize } = devOptions
  // GET CORE CARDS
  const hexedMeadowCardsArr: ArmyCard[] = Object.values(hexedMeadowCards)
  // MAKE CARDS TO GAMECARDS
  const armyCards: GameArmyCard[] = hexedMeadowCardsArr
    // filters for only hm101 and hm201 (3 figure common squads)
    .filter((c) => c.cardID.endsWith('01'))
    //finally return gamecards
    .map(fillGameCardInfo)

  // MAKE GAMECARDS TO GAMEUNITS
  const gameUnits = armyCardsToGameUnits(armyCards)
  // MAKE MAP
  const hexagonMap = makeHexagonShapedMap({
    mapSize,
    withPrePlacedUnits,
    gameUnits,
  })
  return {
    ...generateBaseGameState(),
    armyCards,
    gameUnits,
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
