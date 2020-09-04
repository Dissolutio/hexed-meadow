export const colors = {
  gunmetal: '#22333b',
  gunmetalUrlEncoded: '%2322333b',
  beeYellow: '#ffd500',
  butterflyPurple: '#fc65b8',
  beeYellowUrlEncoded: '%23ffd500',
  butterflyPurpleUrlEncoded: '%23fc65b8',
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
  playerColors: {
    '0': colors.beeYellow,
    '1': colors.butterflyPurple,
  },
}
