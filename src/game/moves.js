"use strict";
exports.__esModule = true;
exports.moveGameUnit = exports.placeOrderMarker = exports.confirmReady = exports.placeUnitOnHex = void 0;
function placeUnitOnHex(G, ctx, hexId, unit) {
    var _a;
    G.boardHexes[hexId].occupyingUnitID = (_a = unit === null || unit === void 0 ? void 0 : unit.unitID) !== null && _a !== void 0 ? _a : '';
}
exports.placeUnitOnHex = placeUnitOnHex;
function confirmReady(G, ctx, playerID) {
    if (ctx.phase === 'placement') {
        G.placementReady[playerID] = true;
    }
    if (ctx.phase === 'placeOrderMarkers') {
        G.orderMarkersReady[playerID] = true;
    }
}
exports.confirmReady = confirmReady;
function placeOrderMarker(G, ctx, pID, orderMarker, gameCardID) {
    G.players[pID].orderMarkers[orderMarker] = gameCardID;
}
exports.placeOrderMarker = placeOrderMarker;
function moveGameUnit(G, ctx) {
    // * check for available move points
    // * check for disengagements
    // * update unit
    // * update boardHex
    // *
}
exports.moveGameUnit = moveGameUnit;
