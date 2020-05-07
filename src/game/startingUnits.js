import { hexedMeadowCards } from './hexedMeadowCards'

// BEES
const beestBuds = hexedMeadowCards['hm101']
// const queenBee = hexedMeadowCards['hm102']
// const spellingBeez = hexedMeadowCards['hm103']
// BUTTERFLIES
const butterFries = hexedMeadowCards['hm201']
// const mamaButterfly = hexedMeadowCards['hm202']
// const butteryScarwings = hexedMeadowCards['hm203']

// MAKE STARTING ARMY CARDS
export const armyCards = [
  // PLAYER 0
  {
    playerID: '0',
    cardQuantity: 1,
    ...beestBuds,
  },
  // PLAYER 1
  {
    playerID: '1',
    cardQuantity: 1,
    ...butterFries,
  },
]

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

export function myInitialPlacementUnits(playerCards, playerUnits) {
  return playerUnits.map((unit) => {
    const armyCard = playerCards.find((card) => card.cardID === unit.cardID)
    return {
      ...unit,
      name: armyCard.name,
    }
  })
}
