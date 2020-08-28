"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.gameUnits = exports.armyCards = void 0;
var hexedMeadowCards_1 = require("./hexedMeadowCards");
// BEES
var beestyBoyzCard = hexedMeadowCards_1.hexedMeadowCards['hm101'];
var beestyBoyz = __assign({ playerID: '0', cardQuantity: 1 }, beestyBoyzCard);
var bSquadCard = hexedMeadowCards_1.hexedMeadowCards['hm102'];
var bSquad = __assign({ playerID: '0', cardQuantity: 1 }, bSquadCard);
var queenBaeCard = hexedMeadowCards_1.hexedMeadowCards['hm103'];
var queenBae = __assign(__assign({}, queenBaeCard), { playerID: '0', cardQuantity: 1 });
// BUTTERFLIES
var butterFriesCard = hexedMeadowCards_1.hexedMeadowCards['hm201'];
var butterFries = __assign({ playerID: '1', cardQuantity: 1 }, butterFriesCard);
var scarwingsCard = hexedMeadowCards_1.hexedMeadowCards['hm202'];
var scarwings = __assign({ playerID: '1', cardQuantity: 1 }, scarwingsCard);
var monarchCard = hexedMeadowCards_1.hexedMeadowCards['hm203'];
var monarch = __assign({ playerID: '1', cardQuantity: 1 }, monarchCard);
// MAKE STARTING ARMY CARDS
var startingArmyCards = [
    // PLAYER 0
    queenBae,
    // beestyBoyz,
    // bSquad,
    // PLAYER 1
    monarch,
];
exports.armyCards = startingArmyCards.map(function (card) {
    var uniquifier = 0;
    function makeGameCardID(card) {
        return "p" + card.playerID + "_" + card.cardID + "_" + uniquifier++;
    }
    return __assign(__assign({}, card), { gameCardID: makeGameCardID(card) });
});
//  MAKE STARTING UNITS
exports.gameUnits = cardsToUnits(exports.armyCards);
function cardsToUnits(cards) {
    // id factory
    var unitID = 0;
    function makeUnitID(playerID) {
        return "u" + unitID++ + "-p" + playerID;
    }
    return cards.reduce(function (result, card) {
        // CARD => FIGURES
        var numFigures = parseInt(card.figures) * card.cardQuantity;
        var figuresArr = Array.apply({}, Array(numFigures));
        // FIGURES => UNITS
        var unitsFromCard = figuresArr.reduce(function (unitsResult) {
            var _a;
            var unitID = makeUnitID(card.playerID);
            var newGameUnit = {
                unitID: unitID,
                cardID: card.cardID,
                playerID: card.playerID,
                gameCardID: card.gameCardID
            };
            return __assign(__assign({}, unitsResult), (_a = {}, _a[unitID] = newGameUnit, _a));
        }, {});
        return __assign(__assign({}, result), unitsFromCard);
    }, {});
}
