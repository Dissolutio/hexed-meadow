export type GameState = {
  armyCards: GameArmyCard[]
  gameUnits: GameUnits
  players: PlayersState
  hexMap: HexMap
  boardHexes: BoardHexes
  startZones: StartZones
  orderMarkers: OrderMarkers
  initiative: string[]
  currentRound: number
  currentOrderMarker: number
  placementReady: PlayerStateToggle
  orderMarkersReady: PlayerStateToggle
  roundOfPlayStartReady: PlayerStateToggle
  unitsMoved: string[]
  unitsAttacked: string[]
}
export type PlayersState = {
  [playerID: string]: {
    orderMarkers: PlayerOrderMarkers
  }
}
export type GameMap = {
  boardHexes: BoardHexes
  startZones: StartZones
  hexMap: HexMap
}
export type HexMap = {
  mapShape: string
  mapSize: number
  hexGridLayout: string
  hexHeight: number
  hexWidth: number
}
export interface BoardHex {
  id: string
  q: number
  r: number
  s: number
  occupyingUnitID: string
  altitude: number
}
export interface BoardHexes {
  [key: string]: BoardHex
}
export interface StartZones {
  [key: string]: string[]
}
export type ArmyCard = {
  name: string
  cardID: string
  race: string
  life: number
  move: number
  range: number
  attack: number
  defense: number
  points: number
  figures: number
  hexes: number
}

export interface GameArmyCard extends ArmyCard {
  playerID: string
  gameCardID: string
  cardQuantity: number
}

export type GameUnit = {
  unitID: string
  playerID: string
  gameCardID: string
  cardID: string
  movePoints: number
  moveRange: MoveRange
}

export interface GameUnits {
  [unitID: string]: GameUnit
}

type PlayerStateToggle = {
  [playerID: string]: boolean
}

export type MoveRange = {
  safe: string[]
  engage: string[]
  disengage: string[]
  denied: string[]
}
export type PlayerOrderMarkers = { [order: string]: string }

export type OrderMarker = {
  gameCardID: string
  order: string
}

export type OrderMarkers = {
  [playerID: string]: OrderMarker[]
}
