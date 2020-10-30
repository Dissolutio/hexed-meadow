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
export type PlayerOrderMarkers = { [order: string]: string }
export type OrderMarker = {
  gameCardID: string
  order: string
}

export type OrderMarkers = {
  [playerID: string]: OrderMarker[]
}
export const initialOrderMarkers: OrderMarkers = makeInitialOrderMarkers()
function makeInitialOrderMarkers(): OrderMarkers {
  const orderMarkers = ['0', '1', '2', 'X']
  const blankOrderMarkers = orderMarkers.reduce((prev, curr) => {
    return [...prev, { gameCardID: '', order: '' }]
  }, [])
  return {
    //TODO increase player count
    '0': blankOrderMarkers,
    '1': blankOrderMarkers,
  }
}

export const initialPlayerState = {
  '0': {
    orderMarkers: {
      '0': '',
      '1': '',
      '2': '',
      X: '',
    },
  },
  '1': {
    orderMarkers: {
      '0': '',
      '1': '',
      '2': '',
      X: '',
    },
  },
}
const devMarkersP0: PlayerOrderMarkers = {
  '0': 'p0_hm102_0',
  '1': 'p0_hm102_0',
  '2': 'p0_hm102_0',
  X: 'p0_hm102_0',
}
const devMarkersP1: PlayerOrderMarkers = {
  '0': 'p1_hm202_0',
  '1': 'p1_hm202_0',
  '2': 'p1_hm202_0',
  X: 'p1_hm202_0',
}
export const devPlayerState = {
  '0': {
    orderMarkers: devMarkersP0,
  },
  '1': {
    orderMarkers: devMarkersP1,
  },
}
