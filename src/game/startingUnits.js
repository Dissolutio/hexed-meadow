import { hexedMeadowCards } from './hexedMeadowCards'

// BEES
const beestyBoyz = hexedMeadowCards['hm101']
const bSquad = hexedMeadowCards['hm102']
const queenBae = hexedMeadowCards['hm103']
// BUTTERFLIES
const butterFries = hexedMeadowCards['hm201']
const scarwings = hexedMeadowCards['hm202']
const monarch = hexedMeadowCards['hm203']

// MAKE STARTING ARMY CARDS
const startingArmyCards = [
  // PLAYER 0
  // {
  //   playerID: '0',
  //   cardQuantity: 1,
  //   ...beestyBoyz,
  // },
  // {
  //   playerID: '0',
  //   cardQuantity: 1,
  //   ...bSquad,
  // },
  {
    playerID: '0',
    cardQuantity: 1,
    ...queenBae,
  },
  // PLAYER 1
  // {
  //   playerID: '1',
  //   cardQuantity: 1,
  //   ...butterFries,
  // },
  // {
  //   playerID: '1',
  //   cardQuantity: 1,
  //   ...scarwings,
  // },
  {
    playerID: '1',
    cardQuantity: 1,
    ...monarch,
  },
]
export const armyCards = startingArmyCards.map((card) => {
  let uniquifier = 0
  function makeGameCardID(card) {
    return `p${card.playerID}cID${card.cardID}n${uniquifier++}`
  }
  return { ...card, gameCardID: makeGameCardID(card) }
})

//  MAKE STARTING UNITS
export const gameUnits = cardsToUnits(armyCards)

function cardsToUnits(cards) {
  // id factory
  let unitID = 0
  function makeUnitID(playerID) {
    return `u${unitID++}-p${playerID}`
  }
  return cards.reduce((result, card) => {
    const numFigures = parseInt(card.figures) * card.cardQuantity
    const figuresArr = Array.apply({}, Array(numFigures))
    // ...
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
