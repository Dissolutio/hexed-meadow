import { rollD20Initiative } from './rollInitiative'

export function placeUnitOnHex(G, ctx, hexId, unit) {
  G.boardHexes[hexId].occupyingUnitID = unit.unitID
}
export function confirmReady(G, ctx, playerID) {
  G.ready[playerID] = true
}
export function rollInitiative(G, ctx) {
  G.initiative = rollD20Initiative([...Array(ctx.numPlayers).keys()])
}
