import React from 'react'
import styled from 'styled-components'
import { UnitIcon } from './UnitIcon'

export const ArmyForPlacing = (props) => {
  const {
    playerID,
    currentPhase,
    confirmReady,
    availableUnits,
    onClickUnit,
    activeUnitID,
  } = props
  const [waiting, setWaiting] = React.useState(false)

  const selectedStyle = (unitID) => {
    if (activeUnitID === unitID) {
      return {
        boxShadow: `0 0 5px rgba(81, 203, 238, 1)`,
        padding: `3px 0px 3px 3px`,
        margin: `5px 1px 3px 0px`,
        border: `1px solid rgba(81, 203, 238, 1)`,
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
      <ul>
        {availableUnits &&
          availableUnits.map((unit) => (
            <li key={unit.unitID}>
              <button
                style={selectedStyle(unit.unitID)}
                onClick={() => onClickUnit(unit.unitID)}
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
  flex-flow: row wrap;
  ${(props) =>
    props.playerID === '0'
      ? `
      color: var(--bee-yellow);
      `
      : `
      color: var(--butterfly-purple);
      `}
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  button {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
  }
  img {
    border-radius: 35%;
    width: auto;
    height: 1.5rem;
  }
  span {
    font-size: 0.3rem;
  }
`
