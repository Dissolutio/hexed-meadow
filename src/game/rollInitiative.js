export function rollD20Initiative(players) {
  const initialRolls = genRolls(players)
  console.log('initialRolls', initialRolls)
  return initialRolls.reduce(rollsToInitiative, [])
}
function rollsToInitiative(prev, curr, i, arr) {
  // Player already in initiative result? Move on
  if (prev.find((elem) => elem === curr.playerID)) {
    return [...prev]
  }
  // Player has tied other player(s) ? Settle tie, add all involved to initiative
  const tiedRolls = arr.filter((rollObj) => rollObj.roll === curr.roll)
  if (tiedRolls.length >= 2) {
    const tiedPlayers = tiedRolls.map((rollObj) => rollObj.playerID)
    const newRollsForTiedPlayers = genRolls(tiedPlayers)
    console.log('newRollsForTiedPlayers', newRollsForTiedPlayers)
    const initiativeFromTieBreaker = newRollsForTiedPlayers.reduce(
      rollsToInitiative,
      []
    )
    return [...prev, ...initiativeFromTieBreaker]
  } else {
    return [...prev, curr.playerID]
  }
}

function genRolls(players) {
  const rolls = players.map(function (playerID) {
    return { playerID: playerID, roll: rollDie(20) }
  })
  return rolls.sort(highToLow)
}
function highToLow(a, b) {
  if (a.roll === b.roll) {
    return 0
  }
  if (a.roll > b.roll) {
    return -1
  }
  if (a.roll < b.roll) {
    return 1
  }
}
function rollDie(sides) {
  if (!sides) sides = 6
  return 1 + Math.floor(Math.random() * sides)
}
function rollDice(number, sides) {
  var total = 0
  while (number-- > 0) total += rollDie(sides)
  return total
}
