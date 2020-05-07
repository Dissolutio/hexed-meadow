import React from 'react'
import styled from 'styled-components'

import { useUIContext } from '../hooks/useUIContext'
import { HamburgerMenuButton } from './HamburgerMenuButton'
import beesBigLogo from '../../assets/beesBigLogo.png'
import butterfliesLogo from '../../assets/butterfliesLogo.png'

export const NavBar = (props) => {
  const { playerID } = useUIContext()
  const TeamHeader = () => {
    if (playerID === '0') {
      return <TeamHeaderStyledImg src={beesBigLogo} />
    }
    if (playerID === '1') {
      return <TeamHeaderStyledImg src={butterfliesLogo} />
    }
    return null
  }
  return (
    <>
      <StyledTopConsole playerID={playerID}>
        <TeamHeader />
        <HamburgerMenuButton playerID={playerID} />
      </StyledTopConsole>
    </>
  )
}
const StyledTopConsole = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: auto;
  padding: 0.3rem;
  ${(props) =>
    props.playerID === '0'
      ? `
      color: var(--bee-yellow);
      `
      : `
      color: var(--butterfly-purple);
      `}
`

const TeamHeaderStyledImg = styled.img`
  height: 7vh;
  width: auto;
`
