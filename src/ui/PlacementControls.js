import React, { useEffect } from 'react'
import {
  useBoardContext,
  usePlacementContext,
  useLayoutContext,
  useUIContext,
} from 'ui/hooks'
import { UnitIcon } from './UnitIcon'
import { ArmyListStyle } from './layout/ArmyListStyle'

export const PlacementControls = () => {
  const { activateDataReadout, activatePlaceOrderMarkers } = useLayoutContext()
  const { placementUnits, onClickPlacementUnit } = usePlacementContext()
  const { playerColor } = useUIContext()
  const {
    playerID,
    placementReady,
    currentPhase,
    confirmReady,
    activeUnitID,
  } = useBoardContext()

  useEffect(() => {
    if (currentPhase === 'placeOrderMarkers') {
      activatePlaceOrderMarkers()
    }
  }, [currentPhase])

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
    confirmReady(playerID)
  }

  if (placementReady[playerID] === true) {
    return (
      <ArmyListStyle playerColor={playerColor}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing armies...</p>
      </ArmyListStyle>
    )
  }
  if (placementUnits.length === 0) {
    return (
      <ArmyListStyle playerColor={playerColor}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Done placing your units?</p>
        <button onClick={makeReady}>CONFIRM PLACEMENT</button>
      </ArmyListStyle>
    )
  }

  return (
    <ArmyListStyle playerColor={playerColor}>
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
