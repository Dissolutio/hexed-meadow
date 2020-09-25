export function getRandomInt(min: number, max: number) {
  //* max and min inclusive
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
