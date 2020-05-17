import React from 'react'
import styled from 'styled-components'
import { useLayoutContext } from './hooks/useLayoutContext'
import { useBoardContext } from './hooks/useBoardContext'

export const DataReadout = ({ activeHex, dataReadoutProps }) => {
  const { activatePlacementControls } = useLayoutContext()

  const {
    activeHexID,
    activeUnitID,
    currentPhase,
    currentPlayer,
    activePlayers,
    playersReady,
    numPlayers,
    currentTurn,
  } = useBoardContext()

  return (
    <section className="data-readout">
      <button onClick={activatePlacementControls}>Placement Controls</button>
      <div>ActiveHex: {`${(activeHexID && activeHexID) || 'none'}`}</div>
      <div>
        Unit on Hex:{' '}
        {`${(activeHexID && activeHexID.occupyingUnitID) || 'none'}`}
      </div>
      <div>Active Unit: {`${(activeUnitID && activeUnitID) || 'none'}`}</div>
      <div>currentPhase: "{currentPhase}"</div>
      <div>currentPlayer: {currentPlayer}</div>
      <div>numPlayers: {numPlayers}</div>
      <div>currentTurn: {currentTurn}</div>
      <div>
        playersReady: 0: {playersReady['0'].toString()}, 1:{' '}
        {playersReady['1'].toString()}
      </div>
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
