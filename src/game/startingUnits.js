import { hexedMeadowCards } from './hexedMeadowCards'

const beestBuds = hexedMeadowCards['hm101']
const queenBee = hexedMeadowCards['hm102']
const spellingBeez = hexedMeadowCards['hm103']
const butterFries = hexedMeadowCards['hm201']
const mamaButterfly = hexedMeadowCards['hm202']
const butteryScarwings = hexedMeadowCards['hm203']

// MAKE STARTING ARMY CARDS
export const armyCards = [
    {
        playerID: '0',
        cardQuantity: 1,
        ...beestBuds,
    },
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
        const unitsFromCard = figuresArr.reduce(
            (unitsResult, figure, i, arr) => {
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
            },
            {}
        )
        return {
            ...result,
            ...unitsFromCard,
        }
    }, {})
}
function convertCardsToStartingUnits(armyCardsInGame) {
    // ID HELPER
    let unitID = 0
    function makeUnitID(playerID) {
        return `u${unitID++}-p${playerID}`
    }
    // MAIN
    const cards = Object.values(armyCardsInGame)
    return cards.reduce((result, card) => {
        const numFigures = parseInt(card.figures) * card.cardQuantity
        const figuresArr = Array.apply({}, Array(numFigures))
        // ...
        const unitsFromCard = figuresArr.reduce(
            (unitsResult, figure, i, arr) => {
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
            },
            {}
        )
        return {
            ...result,
            ...unitsFromCard,
        }
    }, {})
}
