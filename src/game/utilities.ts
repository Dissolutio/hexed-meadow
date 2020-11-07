import { GameUnit, MoveRange } from './startingUnits'
import { BoardHex } from './mapGen'

export function cloneObject(
  obj: { [key: string]: Object } | GameUnit | BoardHex
): any {
  let keys = Object.keys(obj)
  return keys.reduce((clone, curr) => {
    clone[curr] = obj[curr]
    return clone
  }, {})
}

export function deduplicateMoveRange(result: MoveRange): MoveRange {
  return {
    safe: [...new Set(result.safe)],
    engage: [...new Set(result.engage)],
    disengage: [...new Set(result.disengage)],
    denied: [...new Set(result.denied)],
  }
}
