export const phaseNames = {
  placement: 'placement',
  placeOrderMarkers: 'placeOrderMarkers',
  roundOfPlay: 'roundOfPlay',
}

export const stageNames = {
  placeOrderMarkers: 'placeOrderMarkers',
  placingUnits: 'placingUnits',
}

export const OM_COUNT = 3

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
  const om = orderMarkers.reduce((prev, curr) => {
    return [...prev, { gameCardID: '', order: '' }]
  }, [])
  return {
    '0': om,
    '1': om,
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
export const devPlayerState = {
  '0': {
    orderMarkers: {
      // all on Hero
      '0': 'p0_hm103_0',
      '1': 'p0_hm103_0',
      '2': 'p0_hm103_0',
      X: 'p0_hm103_0',
      // // 1st on Squad, rest on Hero
      // '0': 'p0_hm101_0',
      // '1': 'p0_hm103_0',
      // '2': 'p0_hm103_0',
      // X: 'p0_hm103_0',
    },
  },
  '1': {
    orderMarkers: {
      // all on Hero
      '0': 'p1_hm203_0',
      '1': 'p1_hm203_0',
      '2': 'p1_hm203_0',
      X: 'p1_hm203_0',
      // // 1st on Squad, rest on Hero
      // '0': 'p1_hm201_0',
      // '1': 'p1_hm203_0',
      // '2': 'p1_hm203_0',
      // X: 'p1_hm203_0',
    },
  },
}
