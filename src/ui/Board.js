import React, { useState, useEffect } from 'react'

import { useBoardContext } from './useBoardContext'

import { Layout } from './Layout'
import { LogoNavBar } from './LogoNavBar'
import { MapDisplay } from './MapDisplay'
import { DataReadout } from './DataReadout'
import { ArmyForPlacing } from './ArmyForPlacing'

export const Board = (props) => {
  const {
    G,
    ctx,
    moves,
    playerID,
    gameID,
    events,
    reset,
    redo,
    undo,
    step,
    log,
    gameMetadata,
  } = props

  const { setPlayerID } = useBoardContext()
  useEffect(() => {
    setPlayerID(playerID)
  }, [])

  const boardHexes = G.boardHexes
  const startZones = G.startZones
  const mapSize = G.mapSize
  const armyCards = G.armyCards
  const gameUnits = G.gameUnits
  const currentPhase = ctx.phase
  const currentPlayer = ctx.currentPlayer
  const activePlayers = ctx.activePlayers
  const numPlayers = ctx.numPlayers
  const currentTurn = ctx.turn
  const { placeUnit, confirmReady } = moves
  // computed
  const startZone = startZones[playerID]
  const myArmyCards = armyCards.filter((card) => card.playerID === playerID)
  // STATE
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [availableUnits, setAvailableUnits] = useState(() =>
    initialAvailableUnits()
  )
  const [errorMsg, setErrorMsg] = useState('')

  const selectedUnit = gameUnits[activeUnitID]

  function initialAvailableUnits() {
    const myUnits = Object.values(gameUnits).filter(
      (unit) => unit.playerID === playerID
    )
    const unitsForPlacement = myUnits.map((gameUnit) => {
      const armyCard = armyCards.find((card) => card.cardID === gameUnit.cardID)
      return {
        ...gameUnit,
        name: armyCard.name,
      }
    })
    return unitsForPlacement
  }

  function onClickBoardHex(event, sourceHex) {
    // Keep from causing onMapClick
    event.stopPropagation()

    const hexID = sourceHex.id
    const isInStartZone = startZone.includes(hexID)

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
      setAvailableUnits(
        availableUnits.filter((unit) => unit.unitID !== activeUnitID)
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
  const armyForPlacingProps = {
    playerID,
    confirmReady,
    currentPhase,
    availableUnits,
    onClickPlacementUnit,
    activeUnitID,
  }
  const dataReadoutProps = {
    currentPhase,
    currentPlayer,
    activePlayers,
    numPlayers,
    currentTurn,
    errorMsg,
    // <DataReadout
    //     activeHex={boardHexes[activeHexID]}
    //     dataReadoutProps={dataReadoutProps}
    // />
  }
  return (
    <Layout>
      <LogoNavBar playerID={playerID} />
      <MapDisplay mapProps={mapProps} />
      <ArmyForPlacing armyForPlacingProps={armyForPlacingProps} />
    </Layout>
  )
}

export default Board
