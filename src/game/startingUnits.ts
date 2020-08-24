import { hexedMeadowCards } from './hexedMeadowCards'

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
const startingArmyCards = [
  // PLAYER 0
  queenBae,
  // beestyBoyz,
  // bSquad,

  // PLAYER 1
  monarch,
  // butterFries,
  // scarwings,
]
export const armyCards = startingArmyCards.map((card) => {
  let uniquifier = 0
  function makeGameCardID(card) {
    return `p${card.playerID}_${card.cardID}_${uniquifier++}`
  }
  return { ...card, gameCardID: makeGameCardID(card) }
})

//  MAKE STARTING UNITS
export const gameUnits = cardsToUnits(armyCards)

function cardsToUnits(cards) {
  // id factory
  let unitID = 0
  function makeUnitID(playerID: string) {
    return `u${unitID++}-p${playerID}`
  }
  return cards.reduce((result, card) => {
    // CARD => FIGURES
    const numFigures = parseInt(card.figures) * card.cardQuantity
    const figuresArr = Array.apply({}, Array(numFigures))
    // FIGURES => UNITS
    const unitsFromCard = figuresArr.reduce((unitsResult, figure, i, arr) => {
      const unitID = makeUnitID(card.playerID)
      const newGameUnit = {
        unitID,
        cardID: card.cardID,
        playerID: card.playerID,
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
