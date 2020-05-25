export function placeUnitOnHex(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit.unitID
}
export function confirmReady(G, ctx, playerID) {
  console.log('%c⧭', 'color: #73998c', ctx)
  if (ctx.phase === 'placement') {
    G.placementReady[playerID] = true
  }
  if (ctx.phase === 'placeOrderMarkers') {
    G.orderMarkersReady[playerID] = true
  }
  if (ctx.phase === 'rollingInitiative') {
    G.initiativeReady[playerID] = true
  }
}
export function placeOrderMarker(G, ctx, pID, orderMarker, gameCardID) {
  G.players[pID].orderMarkers[orderMarker] = gameCardID
}
export function flipOrderMarker(G, ctx, pID, order) {
  G.orderMarkers[pID][order] = G.players[pID].orderMarkers[order]
}
