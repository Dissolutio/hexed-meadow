export const colors = {
  gray: '#5d576b',
  grayUrlEncoded: '%235d576b',
  // player colors
  beeYellow: '#E0BB00',
  beeYellowUrlEncoded: '%23E0BB00',
  butterflyPurple: '#fc65b8',
  butterflyPurpleUrlEncoded: '%23fc65b8',
  waspRed: '#E4572E',
  waspRedUrlEncoded: '%23E4572E',
  beetleBlue: '#058ed9',
  beetleBlueUrlEncoded: '%23058ed9',
  hummingbirdGreen: '#75DBCD',
  hummingbirdGreenUrlEncoded: '%2375DBCD',
  orange: '#E8AA14',
  orangeUrlEncoded: '%23E8AA14',
}

export const playerColorUrlEncoded = (playerID: string) => {
  if (playerID === '0') {
    return colors.beeYellowUrlEncoded
  }
  if (playerID === '1') {
    return colors.butterflyPurpleUrlEncoded
  }
}

export const theme = {
  colors,
  playerColors: {
    '0': colors.beeYellow,
    '1': colors.butterflyPurple,
  },
}
