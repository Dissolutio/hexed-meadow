import { hexedMeadowCards } from './hexedMeadowCards'


const beestBuds = hexedMeadowCards['101']
const queenBee = hexedMeadowCards['102']
const spellingBeez = hexedMeadowCards['103']
const butterFries = hexedMeadowCards['201']
const mamaButterfly = hexedMeadowCards['202']
const butteryScarwings = hexedMeadowCards['203']

// MAKE STARTING ARMY CARDS
export const armyCardsInGame =
{
  '001': {
    playerID: '0',
    cardQuantity: 1,
    ...beestBuds
  },
  '002': {
    playerID: '1',
    cardQuantity: 1,
    ...butterFries
  },
  // '003': {
  //   playerID: '2',
  //   cardQuantity: 1,
  //   ...beestBuds
  // },
  // '004': {
  //   playerID: '3',
  //   cardQuantity: 1,
  //   ...beestBuds
  // },
}

//  MAKE STARTING UNITS
export const startingUnits = convertCardsToStartingUnits(armyCardsInGame)
function convertCardsToStartingUnits(armyCardsInGame) {
  // id factory
  let unitID = 0
  function makeUnitID(playerID) {
    return `u${unitID++}-p${playerID}`
  }
  // cards...
  const startingUnits = Object.values(armyCardsInGame)
    // ...to figures
    .reduce((result, currentCard) => {
      const figuresArr = Array.apply(null, Array(parseInt(currentCard.figures) * currentCard.cardQuantity))
      // ...to game units
      const unitsFromCurrentCard = figuresArr.reduce((unitsResult, figure, i, arr) => {
        const unitID = makeUnitID(currentCard.playerID)
        const newGameUnit = {
          unitID,
          hsCardID: currentCard.hsCardID,
          playerID: currentCard.playerID,

        }
        return {
          ...unitsResult,
          [unitID]: newGameUnit
        }
      }, {})
      return {
        ...result,
        ...unitsFromCurrentCard
      }
    }, {})
  return startingUnits
}