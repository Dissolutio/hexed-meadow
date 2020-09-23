import { hexedMeadowCards } from './hexedMeadowCards'

export type ArmyCard = {
  name: string
  cardID: string
  race: string
  life: number
  move: number
  range: number
  attack: number
  defense: number
  points: number
  figures: number
  hexes: number
}
export interface GameArmyCard extends ArmyCard {
  playerID: string
  gameCardID: string
  cardQuantity: number
}

// BEES
const beestyBoyzCard = hexedMeadowCards['hm101']
const beestyBoyz = {
  playerID: '0',
  cardQuantity: 1,
  ...beestyBoyzCard,
}
const bSquadCard = hexedMeadowCards['hm102']
const bSquad = {
  playerID: '0',
  cardQuantity: 1,
  ...bSquadCard,
}
const queenBaeCard = hexedMeadowCards['hm103']
const queenBae = { ...queenBaeCard, playerID: '0', cardQuantity: 1 }
// BUTTERFLIES
const butterFriesCard = hexedMeadowCards['hm201']
const butterFries = {
  playerID: '1',
  cardQuantity: 1,
  ...butterFriesCard,
}
const scarwingsCard = hexedMeadowCards['hm202']
const scarwings = {
  playerID: '1',
  cardQuantity: 1,
  ...scarwingsCard,
}
const monarchCard = hexedMeadowCards['hm203']
const monarch = {
  playerID: '1',
  cardQuantity: 1,
  ...monarchCard,
}

// MAKE STARTING ARMY CARDS
export const armyCards: GameArmyCard[] = [
  // PLAYER 0
  queenBae,
  beestyBoyz,
  // bSquad,

  // PLAYER 1
  monarch,
  butterFries,
  // scarwings,
].map((card: GameArmyCard) => {
  let uniquifier = 0
  function makeGameCardID(card: GameArmyCard) {
    return `p${card.playerID}_${card.cardID}_${uniquifier++}`
  }
  return { ...card, gameCardID: makeGameCardID(card) }
})

//  MAKE STARTING UNITS

export type GameUnit = {
  unitID: string
  playerID: string
  gameCardID: string
  cardID: string
  movePoints: number
  moveRange: MoveRange
}
export type MoveRange = {
  safely: string[]
  engage: string[]
  disengage: string[]
  denied: string[]
}
export const baseMoveRange: MoveRange = {
  safely: [],
  engage: [],
  disengage: [],
  denied: [],
}
export interface GameUnits {
  [key: string]: GameUnit
}
export const gameUnits: GameUnits = cardsToUnits(armyCards)

function cardsToUnits(cards: GameArmyCard[]): GameUnits {
  // id factory
  let unitID = 0
  function makeUnitID(playerID: string) {
    return `u${unitID++}-p${playerID}`
  }
  return cards.reduce((result, card) => {
    // CARD => FIGURES
    const numFigures = card.figures * card.cardQuantity
    const figuresArr = Array.apply({}, Array(numFigures))
    // FIGURES => UNITS
    const unitsFromCard = figuresArr.reduce((unitsResult) => {
      const unitID = makeUnitID(card.playerID)
      const newGameUnit = {
        unitID,
        cardID: card.cardID,
        playerID: card.playerID,
        gameCardID: card.gameCardID,
        movePoints: 0,
        moveRange: { ...baseMoveRange },
      }
      return {
        ...unitsResult,
        [unitID]: newGameUnit,
      }
    }, {})
    return {
      ...result,
      ...unitsFromCard,
    }
  }, {})
}
