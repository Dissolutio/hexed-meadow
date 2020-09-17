import React, { useEffect } from 'react'
import {
  useBoardContext,
  usePlacementContext,
  useLayoutContext,
} from 'ui/hooks'
import { UnitIcon } from './UnitIcon'
import { ArmyListStyle } from './layout/ArmyListStyle'

export const PlacementControls = () => {
  const { activateDataReadout, activatePlaceOrderMarkers } = useLayoutContext()
  const { placementUnits, onClickPlacementUnit } = usePlacementContext()
  const {
    playerID,
    placementReady,
    currentPhase,
    confirmPlacementReady,
    activeUnitID,
  } = useBoardContext()

  useEffect(() => {
    if (currentPhase === 'placeOrderMarkers') {
      activatePlaceOrderMarkers()
    }
  }, [currentPhase])

  console.log(`activeUnitID`, activeUnitID)
  const selectedStyle = (unitID) => {
    if (activeUnitID === unitID) {
      return {
        boxShadow: `0 0 2px var(--neon-green)`,
      }
    } else {
      return {}
    }
  }
  const makeReady = () => {
    confirmPlacementReady({ playerID })
  }

  if (placementReady[playerID] === true) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing armies...</p>
      </ArmyListStyle>
    )
  }
  if (placementUnits.length === 0) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Done placing your units?</p>
        <button onClick={makeReady}>CONFIRM PLACEMENT</button>
      </ArmyListStyle>
    )
  }

  return (
    <ArmyListStyle playerID={playerID}>
      <button onClick={activateDataReadout}>Data Readout</button>
      <h2>Place your units below into your Start Zone</h2>
      <p>Select a unit, then the start zone will glow.</p>
      <ul>
        {placementUnits &&
          placementUnits.map((unit) => (
            <li key={unit.unitID}>
              <button
                style={selectedStyle(unit.unitID)}
                onClick={() => onClickPlacementUnit(unit.unitID)}
              >
                <UnitIcon
                  unit={unit}
                  iconProps={{
                    x: '50',
                    y: '50',
                    transform: '',
                  }}
                />
                <span>{unit.name}</span>
              </button>
            </li>
          ))}
      </ul>
    </ArmyListStyle>
  )
}
