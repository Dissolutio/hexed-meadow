import React, { useContext, useState } from 'react'
import { phaseNames } from 'game/constants'

const BoardContext = React.createContext({})

const BoardContextProvider = (props) => {
  const { G, ctx, moves, playerID } = props

  // MOVES
  const {
    placeUnitOnHex,
    confirmPlacementReady,
    confirmOrderMarkersReady,
    placeOrderMarker,
  } = moves
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
  // TODO WIP
  const firstPlayerID = initiative?.['0']
  const firstPlayersFirstOrderMarkerGameCardID =
    G.players?.[firstPlayerID]?.orderMarkers?.['0'] ?? ''
  const currentTurnGameCardID = armyCards.find((armyCard) => {
    return armyCard.gameCardID === firstPlayersFirstOrderMarkerGameCardID
  })?.gameCardID
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
  // SELECTORS
  const isMyTurn = currentPlayer === playerID
  const getBoardHexForUnitID = (unitID) => {
    return Object.values(boardHexes).find((boardHex) => {
      return boardHex?.occupyingUnitID === unitID
    })
  }
  // PLAYER STATE
  const myOrderMarkers = G.players[playerID].orderMarkers

  const isOrderMarkerPhase = currentPhase === phaseNames.placeOrderMarkers
  const isPlacementPhase = currentPhase === phaseNames.placement
  const isTurnPhase = currentPhase === phaseNames.roundOfPlay
  function belongsToPlayer(i) {
    return i.playerID === playerID
  }

  const activeUnit = gameUnits[activeUnitID]
  const boardState = {
    // G
    playerID,
    boardHexes,
    startZones,
    hexMap,
    armyCards,
    gameUnits,
    placementReady,
    orderMarkersReady,
    initiative,
    // MOVES
    placeUnitOnHex,
    confirmPlacementReady,
    placeOrderMarker,
    confirmOrderMarkersReady,
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
    activeUnit,
    currentTurnGameCard,
    currentTurnGameCardID,
    isPlacementPhase,
    isOrderMarkerPhase,
    isTurnPhase,
    // SELECTORS
    isMyTurn,
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
  }

  return (
    <BoardContext.Provider value={boardState}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const boardState = useContext(BoardContext)
  return boardState
}

export { BoardContextProvider, useBoardContext }
