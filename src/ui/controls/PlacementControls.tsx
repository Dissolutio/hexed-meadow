import React from 'react'
import { useBoardContext, usePlacementContext } from 'ui/hooks'
import { CardUnitIcon } from 'ui/icons'
import { ArmyListStyle } from 'ui/layout'

export const PlacementControls = () => {
  const { placementUnits, onClickPlacementUnit } = usePlacementContext()
  const { playerID, G, moves, activeUnitID } = useBoardContext()
  const { placementReady } = G
  const { confirmPlacementReady } = moves
  const makeReady = () => {
    confirmPlacementReady({ playerID })
  }
  const isReady = placementReady[playerID] === true
  const selectedStyle = (unitID) => {
    if (activeUnitID === unitID) {
      return {
        boxShadow: `0 0 2px var(--white)`,
        border: `1px solid var(--white)`,
      }
    } else {
      return {}
    }
  }
  //! RETURN CONFIRM DONE
  if (placementUnits.length === 0 && !isReady) {
    return (
      <ArmyListStyle>
        <p>Done placing your units?</p>
        <button onClick={makeReady}>CONFIRM PLACEMENT</button>
      </ArmyListStyle>
    )
  }
  //! RETURN WAITING
  if (isReady) {
    return (
      <ArmyListStyle>
        <p>Waiting for opponents to finish placing armies...</p>
      </ArmyListStyle>
    )
  }
  return (
    <ArmyListStyle>
      <h2>Place your army within your start zone</h2>
      <p />
      <ul>
        {placementUnits &&
          placementUnits.map((unit) => (
            <li key={unit.unitID}>
              <button
                style={selectedStyle(unit.unitID)}
                onClick={() => onClickPlacementUnit(unit.unitID)}
              >
                <CardUnitIcon unit={unit} />
                <span>{unit.name}</span>
              </button>
            </li>
          ))}
      </ul>
    </ArmyListStyle>
  )
}
