import React, { useContext, useState } from 'react'

const BoardContext = React.createContext({})

const BoardContextProvider = (props) => {
  const { G, ctx, moves, playerID } = props

  // MOVES
  const { placeUnitOnHex, confirmReady, placeOrderMarker } = moves
  // BOARD STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [activeGameCardID, setActiveGameCardID] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  // GAME STATE
  const boardHexes = G.boardHexes
  const startZones = G.startZones
  const myStartZone = startZones[playerID]
  const hexMap = G.hexMap
  const armyCards = G.armyCards
  const myCards = armyCards.filter(belongsToPlayer)
  const gameUnits = G.gameUnits
  const myUnits = Object.values(gameUnits).filter(belongsToPlayer)
  const placementReady = G.placementReady
  const orderMarkersReady = G.orderMarkersReady
  const initiativeReady = G.initiativeReady
  const orderMarker1Ready = G.orderMarker1Ready
  const initiative = G.initiative
  // CTX STATE
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const myCurrentStage = activePlayers?.[playerID] || null
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn
  // PLAYER STATE
  const myOrderMarkers = G.players[playerID].orderMarkers

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
        placeOrderMarker,
        // G
        boardHexes,
        startZones,
        hexMap,
        armyCards,
        gameUnits,
        placementReady,
        orderMarkersReady,
        initiativeReady,
        orderMarker1Ready,
        initiative,
        // CTX
        ctx,
        currentPhase,
        activePlayers,
        myCurrentStage,
        currentPlayer,
        numPlayers,
        currentTurn,
        // PLAYER STATE
        myOrderMarkers,
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
        activeGameCardID,
        setActiveGameCardID,
      }}
    >
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const boardState = useContext(BoardContext)
  const { setErrorMsg, setActiveHexID, activeUnitID } = boardState

  function onClickBoardHex_mainGame(event, sourceHex) {
    event.stopPropagation() // no propagate to background onClick
    const hexID = sourceHex.id
    // no unit, select hex
    if (!activeUnitID) {
      console.log('SELECT HEX', activeUnitID)
      setActiveHexID(hexID)
      setErrorMsg('')
      return
    }
  }

  function onClickMapBackground() {
    setActiveHexID('')
  }

  return {
    ...boardState,
    onClickBoardHex_mainGame,
    onClickMapBackground,
  }
}

export { BoardContextProvider, useBoardContext }
