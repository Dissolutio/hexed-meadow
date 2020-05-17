import React, { useContext, useState } from 'react'

const BoardContext = React.createContext({})

const BoardContextProvider = (props) => {
  const { G, ctx, moves, playerID } = props

  // MOVES
  const { placeUnitOnHex, confirmReady } = moves
  // BOARD STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  // GAME STATE
  const boardHexes = G.boardHexes
  const startZones = G.startZones
  const myStartZone = startZones[playerID]
  const mapSize = G.mapSize
  const armyCards = G.armyCards
  const myCards = armyCards.filter(belongsToPlayer)
  const gameUnits = G.gameUnits
  const myUnits = Object.values(gameUnits).filter(belongsToPlayer)
  const playersReady = G.ready
  // CTX STATE
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn

  function belongsToPlayer(i) {
    return i.playerID === playerID
  }

  const selectedUnit = gameUnits[activeUnitID]

  return (
    <BoardContext.Provider
      value={{
        // PID
        playerID,
        // MOVES
        placeUnitOnHex,
        confirmReady,
        // G
        boardHexes,
        startZones,
        mapSize,
        armyCards,
        gameUnits,
        playersReady,
        // CTX
        currentPhase,
        currentPlayer,
        activePlayers,
        numPlayers,
        currentTurn,
        // COMPUTED
        myStartZone,
        myCards,
        myUnits,
        selectedUnit,
        // BOARD STATE
        errorMsg,
        setErrorMsg,
        activeHexID,
        setActiveHexID,
        activeUnitID,
        setActiveUnitID,
      }}
    >
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const boardState = useContext(BoardContext)
  const {
    errorMsg,
    setErrorMsg,
    activeHexID,
    setActiveHexID,
    activeUnitID,
    setActiveUnitID,
  } = boardState

  function onClickBoardHex_mainGame(event, sourceHex) {
    event.stopPropagation() // no propagate to background onClick
    const hexID = sourceHex.id

    // no unit, select hex
    if (!activeUnitID) {
      console.log('SELECT HEX', activeUnitID)
      setActiveHexID(hexID)
      setErrorMsg('')
      return

      // have unit, clicked valid hex
      // if (activeUnitID && isInStartZone) {
      //   placeUnitOnHex(hexID, selectedUnit)
      //   setPlacementUnits(
      //     placementUnits.filter(
      //       (unit) => unit.unitID !== activeUnitID
      //     )
      //   )
      //   setActiveUnitID('')
      //   setErrorMsg('')
      //   return
      // }

      // have unit, clicked invalid hex
      // if (activeUnitID && !isInStartZone) {
      //   console.log(
      //     'CANNOT PLACE UNIT -- choose hex inside start zone',
      //     activeUnitID
      //   )
      //   setErrorMsg(
      //     'You must place units inside your start zone. Invalid hex selected.'
      //   )
      //   return
      // }
    }
  }
  function onClickMapBackground() {
    console.log('MAP BG CLICKED')
    setActiveHexID('')
  }

  return {
    ...boardState,
    onClickBoardHex_mainGame,
    onClickMapBackground,
  }
}

export { BoardContextProvider, useBoardContext }
