import React from 'react'
import styled from 'styled-components'
import { useBoardContext } from './hooks/useBoardContext'
import { UnitIcon } from './UnitIcon'

export const ArmyForPlacing = ({ armyForPlacingProps }) => {
  const { activateDataReadout } = useBoardContext()
  const {
    playerID,
    currentPhase,
    confirmReady,
    availableUnits,
    onClickPlacementUnit,
    activeUnitID,
  } = armyForPlacingProps
  const [waiting, setWaiting] = React.useState(false)

  const selectedStyle = (unitID) => {
    if (activeUnitID === unitID) {
      return {
        boxShadow: `0 0 2px var(--neon-green)`,
      }
    } else {
      return {}
    }
  }
  if (currentPhase === 'mainGame') {
    return (
      <ArmyListStyle playerID={playerID}>
        <p>{`READY FOR MAIN GAME --- but it ain't built yet :(`}</p>
      </ArmyListStyle>
    )
  }
  if (waiting) {
    return (
      <ArmyListStyle playerID={playerID}>
        <p>Waiting for opponents to finish placing armies...</p>
      </ArmyListStyle>
    )
  }
  if (availableUnits.length === 0) {
    return (
      <ArmyListStyle playerID={playerID}>
        <p>Done placing your units?</p>
        <button
          onClick={() => {
            confirmReady(playerID)
            setWaiting(true)
          }}
        >
          CONFIRM PLACEMENT
        </button>
      </ArmyListStyle>
    )
  }

  return (
    <ArmyListStyle playerID={playerID}>
      <h2>Place your units</h2>
      <button onClick={activateDataReadout}>Data Readout</button>
      <ul>
        {availableUnits &&
          availableUnits.map((unit) => (
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
                    fontSize: '1rem',
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
  }
  button {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: center;
    background: var(--black);
    width: 100%;
    height: 100%;
    border: 0.1px solid
      ${(props) =>
        props.playerID === '0'
          ? `
    var(--bee-yellow);
    `
          : `
    var(--butterfly-purple);
    `};
  }
  img {
    width: auto;
    height: 10rem;
  }
  span {
    font-size: 0.5rem;
    ${(props) =>
      props.playerID === '0'
        ? `
    color: var(--bee-yellow);
    `
        : `
    color: var(--butterfly-purple);
    `}
  }
`
