import { hexedMeadowCards } from "./hexedMeadowCards";

const beestBuds = hexedMeadowCards[0];
const queenBee = hexedMeadowCards[1];
const spellingBeez = hexedMeadowCards[2];
const butterFries = hexedMeadowCards[3];
const mamaButterfly = hexedMeadowCards[4];
const butteryScarwings = hexedMeadowCards[5];

// MAKE STARTING ARMY CARDS
export const armyCards = [
  {
    playerID: "0",
    cardQuantity: 1,
    ...beestBuds,
  },
  {
    playerID: "1",
    cardQuantity: 1,
    ...butterFries,
  },
];

//  MAKE STARTING UNITS
export const gameUnits2 = cardsToUnits(armyCards);

function cardsToUnits(cards) {
  // id factory
  let unitID = 0;
  function makeUnitID(playerID) {
    return `u${unitID++}-p${playerID}`;
  }
  return cards.reduce((result, card) => {
    const numFigures = parseInt(card.figures) * card.cardQuantity;
    const figuresArr = Array.apply({}, Array(numFigures));
    // ...
    const unitsFromCard = figuresArr.reduce((unitsResult, figure, i, arr) => {
      const unitID = makeUnitID(card.playerID);
      const newGameUnit = {
        unitID,
        cardID: card.cardID,
        playerID: card.playerID,
      };
      return {
        ...unitsResult,
        [unitID]: newGameUnit,
      };
    }, {});
    return {
      ...result,
      ...unitsFromCard,
    };
  }, {});
}
function convertCardsToStartingUnits(armyCardsInGame) {
  // id factory
  let unitID = 0;
  function makeUnitID(playerID) {
    return `u${unitID++}-p${playerID}`;
  }
  // cards to gameUnits
  const cards = Object.values(armyCardsInGame);
  return cards.reduce((result, card) => {
    const numFigures = parseInt(card.figures) * card.cardQuantity;
    const figuresArr = Array.apply({}, Array(numFigures));
    // ...
    const unitsFromCard = figuresArr.reduce((unitsResult, figure, i, arr) => {
      const unitID = makeUnitID(card.playerID);
      const newGameUnit = {
        unitID,
        cardID: card.cardID,
        playerID: card.playerID,
      };
      return {
        ...unitsResult,
        [unitID]: newGameUnit,
      };
    }, {});
    return {
      ...result,
      ...unitsFromCard,
    };
  }, {});
}
