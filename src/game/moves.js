export function placeUnitOnHex(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit.unitID
}
export function confirmReady(G, ctx, playerID) {
  if (ctx.phase === 'placement') {
    G.placementReady[playerID] = true
  }
  if (ctx.phase === 'placeOrderMarkers') {
    G.orderMarkersReady[playerID] = true
  }
}
export function placeOrderMarker(G, ctx, pID, orderMarker, gameCardID) {
  G.players[pID].orderMarkers[orderMarker] = gameCardID
}
export function moveGameUnit(G, ctx) {
  // * check for available move points
  // * check for disengagements
  // * update unit
  // * update boardHex
  // *
}
