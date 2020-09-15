export const phaseNames = {
  placement: 'placement',
  placeOrderMarkers: 'placeOrderMarkers',
  roundOfPlay: 'roundOfPlay',
}

export const stageNames = {
  placeOrderMarkers: 'placeOrderMarkers',
  placingUnits: 'placingUnits',
  takingTurn: 'takingTurn',
  watchingTurn: 'watchingTurn',
}

export const OM_COUNT = 3

export type OrderMarkers = {
  [key: string]: {
    unrevealed: string[]
    revealed: {
      [key: string]: string
    }
  }
}
export const initialOrderMarkers = (): OrderMarkers => {
  const arr = ['0', '1', '2', 'X']
  const revealed = arr.reduce((prev, curr) => {
    return { ...prev, [curr]: '' }
  }, {})
  const unrevealed = arr.map((om) => '')
  const om = {
    unrevealed,
    revealed,
  }
  return {
    '0': om,
    '1': om,
  }
}
