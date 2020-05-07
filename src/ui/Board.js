import React, { useState, useEffect } from 'react'

import { useUIContext } from './hooks/useUIContext'
import { useBoardContext } from './hooks/useBoardContext'

import { Layout } from './layout/Layout'
import { NavBar } from './layout/NavBar'
import { MapDisplay } from './MapDisplay'
import { DataReadout } from './DataReadout'
import { PlacementControls } from './PlacementControls'

import { myInitialPlacementUnits } from '../game/startingUnits'

export const Board = (props) => {
  const { G, ctx, moves, playerID } = props
  const { topConsoleComponent, bottomConsoleComponent } = useBoardContext()

  const boardHexes = G.boardHexes
  const startZones = G.startZones
  const mapSize = G.mapSize
  const armyCards = G.armyCards
  const gameUnits = G.gameUnits
  const playersReady = G.ready
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn
  const { placeUnit, confirmReady } = moves
  // COMPUTED
  const myStartZone = startZones[playerID]
  const myCards = armyCards.filter((card) => card.playerID === playerID)
  const myUnits = Object.values(gameUnits).filter(
    (unit) => unit.playerID === playerID
  )
  // STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [availableUnitsForPlacement, setAvailableUnitsForPlacement] = useState(
    myInitialPlacementUnits(myCards, myUnits)
  )
  const [errorMsg, setErrorMsg] = useState('')

  // useEffect(() => {
  //   setPlayerID(playerID)
  // }, [playerID, setPlayerID])

  const selectedUnit = gameUnits[activeUnitID]

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
        setErrorMsg('')
        return
      }
      // have unit, clicked in start zone, place unit
      if (activeUnitID && isInStartZone) {
        placeUnit(hexID, selectedUnit)
        setAvailableUnitsForPlacement(
          availableUnitsForPlacement.filter(
            (unit) => unit.unitID !== activeUnitID
          )
        )
        setActiveUnitID('')
        setErrorMsg('')
        return
      }
      // have unit, clicked hex outside start zone, error
      if (activeUnitID && !isInStartZone) {
        console.log(
          'CANNOT PLACE UNIT -- choose hex inside start zone',
          activeUnitID
        )
        setErrorMsg(
          'You must place units inside your start zone. Invalid hex selected.'
        )
        return
      }
    }
    function mainGameHandle() {
      if (!activeUnitID) {
        console.log('SELECT HEX', activeUnitID)
        setActiveHexID(hexID)
        setErrorMsg('')
        return
      }
      // have unit, clicked in start zone, place unit
      if (activeUnitID && isInStartZone) {
        placeUnit(hexID, selectedUnit)
        setAvailableUnitsForPlacement(
          availableUnitsForPlacement.filter(
            (unit) => unit.unitID !== activeUnitID
          )
        )
        setActiveUnitID('')
        setErrorMsg('')
        return
      }
      // have unit, clicked hex outside start zone, error
      if (activeUnitID && !isInStartZone) {
        console.log(
          'CANNOT PLACE UNIT -- choose hex inside start zone',
          activeUnitID
        )
        setErrorMsg(
          'You must place units inside your start zone. Invalid hex selected.'
        )
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

  const mapProps = {
    boardHexes,
    currentPhase,
    startZones,
    mapSize,
    armyCards,
    gameUnits,
    playerID,
    activeHexID,
    activeUnitID,
    onClickBoardHex,
    onClickMapBackground,
  }
  const placementControlsProps = {
    playerID,
    confirmReady,
    currentPhase,
    playersReady,
    availableUnits: availableUnitsForPlacement,
    onClickPlacementUnit,
    activeUnitID,
  }
  const dataReadoutProps = {
    activeHexID,
    activeUnitID,
    currentPhase,
    currentPlayer,
    activePlayers,
    numPlayers,
    currentTurn,
    errorMsg,
    playersReady,
    // <DataReadout
    //     activeHex={boardHexes[activeHexID]}
    //     dataReadoutProps={dataReadoutProps}
    // />
  }
  const TopConsole = () => {
    switch (topConsoleComponent) {
      case 'NavBar':
        return <NavBar playerID={playerID} />
      default:
        return null
    }
  }
  const BottomConsole = () => {
    switch (bottomConsoleComponent) {
      case 'DataReadout':
        return <DataReadout dataReadoutProps={dataReadoutProps} />
      case 'PlacementControls':
        return (
          <PlacementControls placementControlsProps={placementControlsProps} />
        )
      default:
        return null
    }
  }
  return (
    <Layout>
      <TopConsole />
      <MapDisplay mapProps={mapProps} />
      <BottomConsole />>
    </Layout>
  )
}

export default Board
