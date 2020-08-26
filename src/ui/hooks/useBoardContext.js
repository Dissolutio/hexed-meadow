import React, { useContext, useState } from 'react'
import { phaseNames } from 'game/constants'

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
  const initiative = G.initiative
  const currentTurnGameCardID = G.currentTurnGameCardID
  const currentTurnGameCard = G.armyCards.find(
    (armyCard) => armyCard.gameCardID === currentTurnGameCardID
  )
  // CTX STATE
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const myCurrentStage = activePlayers?.[playerID] || null
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn
  const isTurnPhase = currentPhase === 'roundOfPlay'
  // SELECTORS
  const getBoardHexForUnitID = (unitID) => {
    return Object.values(boardHexes).find((boardHex) => {
      return boardHex?.occupyingUnitID === unitID
    })
  }
  // PLAYER STATE
  const myOrderMarkers = G.players[playerID].orderMarkers

  function belongsToPlayer(i) {
    return i.playerID === playerID
  }

  const activeUnit = gameUnits[activeUnitID]

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
        initiative,
        // CTX
        ctx,
        currentPhase,
        activePlayers,
        myCurrentStage,
        currentPlayer,
        numPlayers,
        currentTurn,
        isTurnPhase,
        // PLAYER STATE
        myOrderMarkers,
        // COMPUTED
        myStartZone,
        myCards,
        myUnits,
        activeUnit,
        currentTurnGameCard,
        currentTurnGameCardID,
        // SELECTORS
        getBoardHexForUnitID,
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
  const { setActiveHexID } = boardState

  function onClickMapBackground() {
    setActiveHexID('')
  }

  return {
    ...boardState,
    onClickMapBackground,
  }
}

export { BoardContextProvider, useBoardContext }
