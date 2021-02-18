import { Hex } from 'react-hexgrid'
import {
  MoveRange,
  OrderMarkers,
  PlayerOrderMarkers,
  PlayersState,
} from './types'

export const phaseNames = {
  placement: 'placement',
  placeOrderMarkers: 'placeOrderMarkers',
  roundOfPlay: 'roundOfPlay',
}

export const stageNames = {
  placeOrderMarkers: 'placeOrderMarkers',
  placingUnits: 'placingUnits',
  attacking: 'attacking',
}

export const OM_COUNT = 3
const orders = ['0', '1', '2', 'X']

export function generateBlankOrderMarkers(): OrderMarkers {
  const blankOrderMarkers = orders.reduce((prev, curr) => {
    return [...prev, { gameCardID: '', order: '' }]
  }, [])
  return {
    '0': blankOrderMarkers,
    '1': blankOrderMarkers,
  }
}
export function generateBlankPlayersState(): PlayersState {
  return {
    '0': {
      orderMarkers: generateBlankPlayersOrderMarkers(),
    },
    '1': {
      orderMarkers: generateBlankPlayersOrderMarkers(),
    },
  }
}
export function generateBlankPlayersOrderMarkers(): PlayerOrderMarkers {
  return {
    '0': '',
    '1': '',
    '2': '',
    X: '',
  }
}

export const generateHexID = (hex: Hex) => {
  return `${hex.q},${hex.r},${hex.s}`
}
export function generateBlankMoveRange(): MoveRange {
  return { safe: [], engage: [], disengage: [], denied: [] }
}
