import React from 'react'
import styled from 'styled-components'
import { useLayoutContext } from './hooks/useLayoutContext'
import { useBoardContext } from './hooks/useBoardContext'

export const DataReadout = ({ activeHex, dataReadoutProps }) => {
  const { activatePlacementControls } = useLayoutContext()

  const {
    activeHexID,
    activeUnitID,
    boardHexes,
    currentPhase,
    currentPlayer,
    numPlayers,
    currentTurn,
  } = useBoardContext()

  return (
    <section className="data-readout">
      <button onClick={activatePlacementControls}>Placement Controls</button>
      <div>ActiveHex: {activeHexID}</div>
      <div>
        Unit on Hex:{' '}
        {`${
          (activeHexID && boardHexes[activeHexID].occupyingUnitID) || 'none'
        }`}
      </div>
      <div>Active Unit: {`${(activeUnitID && activeUnitID) || 'none'}`}</div>
      <div>currentPhase: "{currentPhase}"</div>
      <div>currentPlayer: {currentPlayer}</div>
      <div>numPlayers: {numPlayers}</div>
      <div>currentTurn: {currentTurn}</div>
    </section>
  )
}
const Styles = styled.section`
  display: flex;
  flex-flow: column wrap;
  height: 100%;
  color: var(--black);
  font-size: 0.8rem;
`
