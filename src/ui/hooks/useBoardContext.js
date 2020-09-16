import React, { useContext, useState } from 'react'
// FOR TYPES
// import { BoardProps } from 'boardgame.io/react'
import { phaseNames, stageNames } from 'game/constants'

const BoardContext = React.createContext({})

const BoardContextProvider = (props) => {
  const { G, ctx, moves, playerID } = props
  // MOVES
  const {
    placeUnitOnHex,
    confirmPlacementReady,
    placeOrderMarker,
    confirmOrderMarkersReady,
    confirmRoundOfPlayStartReady,
    endCurrentPlayerTurn,
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
  const initiative = G.initiative
  const currentOrderMarker = G.currentOrderMarker
  const placementReady = G.placementReady
  const orderMarkersReady = G.orderMarkersReady

  // TODO WIP
  // both players see this
  const firstPlayerID = initiative?.['0']
  // const activeTurnGameCardID = currentOrderMarker
  // only current player sees these 3
  const firstPlayersFirstOrderMarkerGameCardID =
    G.players?.[firstPlayerID]?.orderMarkers?.['0'] ?? ''
  const currentTurnGameCardID = armyCards.find((armyCard) => {
    return armyCard.gameCardID === firstPlayersFirstOrderMarkerGameCardID
  })?.gameCardID
  const currentTurnGameCard = G.armyCards.find(
    (armyCard) => armyCard.gameCardID === currentTurnGameCardID
  )
  // TODO WIP END

  // CTX STATE
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn
  // SELECTORS
  const isMyTurn = currentPlayer === playerID
  const getGameCardByID = (gameCardID) => {
    return armyCards.find((card) => card.gameCardID === gameCardID)
  }
  const getBoardHexForUnitID = (unitID) => {
    return Object.values(boardHexes).find((boardHex) => {
      return boardHex?.occupyingUnitID === unitID
    })
  }
  // PLAYER STATE
  const myCurrentStage = ctx.activePlayers?.[playerID] || null
  const myOrderMarkers = G.players?.[playerID]?.orderMarkers
  function belongsToPlayer(anything) {
    return anything.playerID === playerID
  }
  // PHASES / STAGES
  const isOrderMarkerPhase = currentPhase === phaseNames.placeOrderMarkers
  const isPlacementPhase = currentPhase === phaseNames.placement
  const isTurnPhase = currentPhase === phaseNames.roundOfPlay
  const hasConfirmedRoundOfPlayStart =
    isTurnPhase && G.roundOfPlayStartReady[playerID]
  const isTakingTurnStage = myCurrentStage === stageNames.takingTurn
  const isWatchingTurnStage = myCurrentStage === stageNames.watchingTurn

  const activeUnit = gameUnits[activeUnitID]
  const boardState = {
    // G
    playerID,
    boardHexes,
    startZones,
    hexMap,
    armyCards,
    gameUnits,
    initiative,
    currentOrderMarker,
    placementReady,
    orderMarkersReady,
    // MOVES
    placeUnitOnHex,
    confirmPlacementReady,
    placeOrderMarker,
    confirmOrderMarkersReady,
    confirmRoundOfPlayStartReady,
    endCurrentPlayerTurn,
    // CTX
    ctx,
    currentPhase,
    activePlayers,
    currentPlayer,
    numPlayers,
    currentTurn,
    // PLAYER STATE
    myOrderMarkers,
    myCurrentStage,
    // COMPUTED
    myStartZone,
    myCards,
    myUnits,
    activeUnit,
    currentTurnGameCard,
    currentTurnGameCardID,
    // PHASES / STAGES
    isPlacementPhase,
    isOrderMarkerPhase,
    isTurnPhase,
    hasConfirmedRoundOfPlayStart,
    isTakingTurnStage,
    isWatchingTurnStage,
    // SELECTORS
    isMyTurn,
    getBoardHexForUnitID,
    getGameCardByID,
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
