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
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn

  function belongsToPlayer(i) {
    return i.playerID === playerID
  }
  // PLACEMENT STATE
  const [availableUnitsForPlacement, setAvailableUnitsForPlacement] = useState(
    myInitialPlacementUnits()
  )
  const placeAvailablePlacementUnit = (unit) => {
    console.log(': ----------------------------------------')
    console.log('placeAvailablePlacementUnit -> unit', unit)
    console.log(': ----------------------------------------')
    setAvailableUnitsForPlacement((s) =>
      s.filter((u) => u.unitID === unit.unitID)
    )
  }
  function myInitialPlacementUnits() {
    return myUnits.map((unit) => {
      const armyCard = myCards.find((card) => card.cardID === unit.cardID)
      return {
        ...unit,
        name: armyCard.name,
      }
    })
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
        activeHexID,
        setActiveHexID,
        activeUnitID,
        setActiveUnitID,
        // PLACEMENT STATE
        availableUnitsForPlacement,
        setAvailableUnitsForPlacement,
        placeAvailablePlacementUnit,
      }}
    >
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const boardState = useContext(BoardContext)
  const {
    activeHexID,
    activeUnitID,
    availableUnitsForPlacement,
    setActiveHexID,
    setActiveUnitID,
    setAvailableUnitsForPlacement,
    placeAvailablePlacementUnit,
    myStartZone,
    currentPhase,
    selectedUnit,
    placeUnitOnHex,
  } = boardState

  function onClickMapBackground() {
    console.log('MAP BG CLICKED')
    setActiveHexID('')
  }
  function onClickBoardHex(event, sourceHex) {
    // Do not propagate to background onClick
    event.stopPropagation()

    const hexID = sourceHex.id
    const isInStartZone = myStartZone.includes(hexID)

    switch (currentPhase) {
      case 'mainGame':
        mainGameHandle()
        break
      case 'placementPhase':
        placementHandle()
        break
      default:
        placementHandle()
    }
    function placementHandle() {
      //  No unit, select hex
      if (!activeUnitID) {
        console.log('SELECT HEX', activeUnitID)
        setActiveHexID(hexID)
        // setErrorMsg('')
        return
      }
      // have unit, clicked in start zone, place unit
      if (activeUnitID && isInStartZone) {
        placeUnitOnHex(hexID, selectedUnit)
        placeAvailablePlacementUnit(selectedUnit)
        setActiveUnitID('')
        // setErrorMsg('')
        return
      }
      // have unit, clicked hex outside start zone, error
      if (activeUnitID && !isInStartZone) {
        console.log(
          'CANNOT PLACE UNIT -- choose hex inside start zone',
          activeUnitID
        )
        // setErrorMsg(
        //   'You must place units inside your start zone. Invalid hex selected.'
        // )
        return
      }
    }
    function mainGameHandle() {
      if (!activeUnitID) {
        console.log('SELECT HEX', activeUnitID)
        setActiveHexID(hexID)
        // setErrorMsg('')
        return
      }
      // have unit, clicked in start zone, place unit
      if (activeUnitID && isInStartZone) {
        placeUnitOnHex(hexID, selectedUnit)
        setAvailableUnitsForPlacement(
          availableUnitsForPlacement.filter(
            (unit) => unit.unitID !== activeUnitID
          )
        )
        setActiveUnitID('')
        // setErrorMsg('')
        return
      }
      // have unit, clicked hex outside start zone, error
      if (activeUnitID && !isInStartZone) {
        console.log(
          'CANNOT PLACE UNIT -- choose hex inside start zone',
          activeUnitID
        )
        // setErrorMsg(
        //   'You must place units inside your start zone. Invalid hex selected.'
        // )
        return
      }
    }
  }
  function onClickMapBackground() {
    console.log('MAP BG CLICKED')
    setActiveHexID('')
  }
  function onClickPlacementUnit(unitID) {
    // either deselect unit, or select unit and deselect active hex
    if (unitID === activeUnitID) {
      setActiveUnitID('')
    } else {
      setActiveUnitID(unitID)
      setActiveHexID('')
    }
  }
  return {
    ...boardState,
    onClickBoardHex,
    onClickMapBackground,
    onClickPlacementUnit,
  }
}

export { BoardContextProvider, useBoardContext }
