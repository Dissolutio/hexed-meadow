import React, { useState } from 'react'
import styled from 'styled-components'

import { BoardContextProvider, useBoardContext } from './useBoardContext'

import { TopConsole } from './TopConsole'
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
  const { placeUnit } = moves
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
        unitID: gameUnit.unitID,
        name: armyCard.name,
      }
    })
    console.log('%c⧭', 'color: red', unitsForPlacement)
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

  // const dataReadoutProps = {
  //     currentPhase,
  //     currentPlayer,
  //     activePlayers,
  //     numPlayers,
  //     currentTurn,
  //     errorMsg,
  // <DataReadout
  //     activeHex={boardHexes[activeHexID]}
  //     dataReadoutProps={dataReadoutProps}
  // />
  // }

  return (
    <BoardContextProvider>
      <LayoutFlexColumn>
        <div className="top-console">
          <TopConsole playerID={playerID} />
        </div>
        <MainDisplay className={`board-${playerID}`}>
          <MapDisplay mapProps={mapProps} />
        </MainDisplay>
        <BottomConsole>
          <ArmyForPlacing
            availableUnits={availableUnits}
            onClickUnit={onClickPlacementUnit}
            activeUnitID={activeUnitID}
            errorMsg={errorMsg}
          />
        </BottomConsole>
      </LayoutFlexColumn>
    </BoardContextProvider>
  )
}

const LayoutFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  .top-console {
    /* position: fixed;
    top: 0; */
    color: var(--black);
    height: 10%;
    width: 100%;
  }
`
const MainDisplay = styled.div`
  height: 75%;
  overflow: auto;
  width: 100%;
  ::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track-piece {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-corner {
    background: white;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }
  &.board-0 {
    background: var(--forest-green);
    background: radial-gradient(ellipse at top, var(--bee-yellow), transparent),
      radial-gradient(ellipse at bottom, var(--black), transparent);
    ::-webkit-scrollbar-track-piece {
      /* box-shadow: inset 0 0 3px var(--bee-yellow); */
    }
    ::-webkit-scrollbar-thumb {
      background: var(--bee-yellow);
    }
  }
  &.board-1 {
    background: var(--forest-green);
    background: radial-gradient(
        ellipse at top,
        var(--butterfly-purple),
        transparent
      ),
      radial-gradient(ellipse at bottom, var(--black), transparent);
    ::-webkit-scrollbar-track-piece {
      box-shadow: inset 0 0 5px var(--butterfly-purple);
      background-color: white;
      /* width: 0.5rem; */
    }
    ::-webkit-scrollbar-thumb {
      background: var(--butterfly-purple);
    }
  }
`
const BottomConsole = styled.div`
  /* position: fixed;
  bottom: 0; */
  height: 15%;
  width: 100%;
  section.data-readout {
    display: flex;
    flex-flow: column wrap;
    height: 100%;
    color: var(--black);
    font-size: 0.8rem;
  }
`

export default Board
