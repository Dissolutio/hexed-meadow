import React from 'react'
import styled from 'styled-components'
import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'
import { UnitIcon } from './UnitIcon'

export const PlacementControls = ({ placementControlsProps }) => {
  const { activateDataReadout } = useLayoutContext()
  const {
    playerID,
    playersReady,
    currentPhase,
    confirmReady,
    activeUnitID,
    availableUnitsForPlacement: availableUnitsForPlacement,
    onClickPlacementUnit,
  } = useBoardContext()

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

  if (currentPhase === 'mainGame') {
    return (
      <ArmyListStyle playerID={playerID}>
        <p>{`READY FOR MAIN GAME --- but it ain't built yet :(`}</p>
      </ArmyListStyle>
    )
  }
  if (playersReady[playerID] === true) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing armies...</p>
      </ArmyListStyle>
    )
  }
  if (availableUnitsForPlacement.length === 0) {
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
        {availableUnitsForPlacement &&
          availableUnitsForPlacement.map((unit) => (
            <li key={unit.unitID}>
              <button
                style={selectedStyle(unit.unitID)}
                onClick={() => onClickPlacementUnit(unit.unitID)}
              >
                <UnitIcon
                  unit={unit}
                  iconProps={{
                    x: '10',
                    y: '10',
                    fontSize: '3rem',
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
const ArmyListStyle = styled.div`
  display: flex;
  flex-flow: column nowrap;
  color: var(--mainColor);
  h2 {
    font-size: 1.3rem;
    margin: 0;
    text-align: center;
  }
  button {
    color: var(--mainColor);
  }
  ul {
    display: flex;
    flex-flow: row wrap;
    flex-grow: 1;
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      padding: 0.3rem;
    }
  }
  button {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: center;
    background: var(--black);
    width: 100%;
    height: 100%;
    border: 0.1px solid var(--mainColor);
  }
  img {
    width: auto;
  }
  span {
    font-size: 1rem;
  }
`
