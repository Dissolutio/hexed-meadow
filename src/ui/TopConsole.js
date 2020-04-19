import React from 'react'
import styled from 'styled-components'

export const TopConsole = (props) => {
  const { playerID, currentPhase } = props

  return (
    <StyledTopConsole playerID={playerID}>
      <h1>{playerID.toString() === '0' ? 'Bees' : 'Butterflies'}</h1>
    </StyledTopConsole>
  )
}

const StyledTopConsole = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  h1 {
    margin: 0;
  }
  ${(props) =>
    props.playerID === '0'
      ? `
      color: var(--bee-yellow);
      `
      : `
      color: var(--butterfly-purple);
      `}
`
