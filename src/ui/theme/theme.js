export const colors = {
  // gunmetal: '#22333b',
  // gunmetalUrlEncoded: '%2322333b',
  gray: '#5d576b',
  grayUrlEncoded: '%235d576b',

  //players
  // beeYellow: '#FFDD33',
  // beeYellow: '#F5CC00',
  beeYellow: '#E0BB00',
  butterflyPurple: '#fc65b8',
  waspRed: '#E4572E',
  beetleBlue: '#058ed9',
  hummingbirdGreen: '#75DBCD',
  orange: '#E8AA14',

  //players - encoded
  // beeYellowUrlEncoded: '%23FFDD33',
  // beeYellowUrlEncoded: '%23F5CC00',
  beeYellowUrlEncoded: '%23E0BB00',
  butterflyPurpleUrlEncoded: '%23fc65b8',
  waspRedUrlEncoded: '%23E4572E',
  beetleBlueUrlEncoded: '%23058ed9',
  hummingbirdGreenUrlEncoded: '%2375DBCD',
  orangeUrlEncoded: '%23E8AA14',
}

export const playerColorUrlEncoded = (playerID) => {
  if (playerID === '0') {
    return colors.beeYellowUrlEncoded
  }
  if (playerID === '1') {
    return colors.butterflyPurpleUrlEncoded
  }
}

export const theme = {
  colors,
  cssPlayerColor: 'var(--player-color)',
  playerColors: {
    '0': colors.beeYellow,
    '1': colors.butterflyPurple,
  },
}
