import React from 'react'
import styled from 'styled-components'
import { useBoardContext } from './hooks/useBoardContext'

export const DataReadout = ({ activeHex, dataReadoutProps }) => {
  const { activatePlacementControls } = useBoardContext()

  const {
    currentPhase,
    currentPlayer,
    activePlayers,
    numPlayers,
    currentTurn,
  } = dataReadoutProps

  return (
    <section className="data-readout">
      <button onClick={activatePlacementControls}>Placement Controls</button>
      <div>ActiveHex: {`${(activeHex && activeHex.id) || 'none'}`}</div>
      <div>
        Unit on Hex: {`${(activeHex && activeHex.occupyingUnitID) || 'none'}`}
      </div>
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
