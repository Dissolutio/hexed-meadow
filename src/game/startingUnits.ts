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

export type GameUnit = {
  unitID: string
  playerID: string
  gameCardID: string
  cardID: string
  movePoints: number
  moveRange: MoveRange
}

export interface GameUnits {
  [unitID: string]: GameUnit
}

export type MoveRange = {
  safe: string[]
  engage: string[]
  disengage: string[]
  denied: string[]
}

export function makeBlankMoveRange(): MoveRange {
  return { safe: [], engage: [], disengage: [], denied: [] }
}
//🛠 INITIAL ARMY CARDS
export const armyCards: GameArmyCard[] = Object.values(hexedMeadowCards).map(
  fillGameCardInfo
)
export const gameUnits: GameUnits = cardsToUnits(armyCards)

function fillGameCardInfo(card: GameArmyCard): GameArmyCard {
  // the uniquifier is included to allow future use of more than one of a card (For uncommon cards, or perhaps repeat use of unique cards)
  let uniquifier = 0
  const newCard = {
    ...card,
    playerID: playerIDByCardRace(card),
    cardQuantity: 1,
  }
  function playerIDByCardRace(card: ArmyCard) {
    return card.race === 'bee' ? '0' : '1'
  }
  function makeGameCardID(card: GameArmyCard) {
    return `p${card.playerID}_${card.cardID}_${uniquifier++}`
  }
  return {
    ...newCard,
    gameCardID: makeGameCardID(newCard),
  }
}

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
        moveRange: { safe: [], engage: [], disengage: [], denied: [] },
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
