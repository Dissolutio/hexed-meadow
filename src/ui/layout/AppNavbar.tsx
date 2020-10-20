import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import { useBoardContext } from 'ui/hooks'
import beesBigLogo from 'assets/beesBigLogo.png'
import butterfliesLogo from 'assets/butterfliesLogo.png'

export const AppNavbar = () => {
  const { playerID } = useBoardContext()
  const opponentPlayerID = playerID === '0' ? '1' : '0'
  const isProductionApp = process.env.NODE_ENV === 'production'
  return (
    <StyledTopConsole collapseOnSelect expand="lg" playerID={playerID}>
      <Navbar.Brand
        href={
          isProductionApp
            ? `/team${opponentPlayerID}`
            : `/#player${opponentPlayerID}`
        }
      >
        <PlayerTeamLogo
          playerID={playerID}
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        label="Toggle navigation"
      >
        <StyledSpan>
          <svg viewBox="0 0 100 70" width="20" height="20">
            <rect width="100" height="10" rx="8" strokeWidth="1" />
            <rect y="30" width="100" height="10" rx="8" strokeWidth="1" />
            <rect y="60" width="100" height="10" rx="8" strokeWidth="1" />
          </svg>
        </StyledSpan>
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to={'/help'}>
            Help
          </Nav.Link>
          <Nav.Link as={Link} to={'/feedback'}>
            Feedback
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </StyledTopConsole>
  )
}
const _StyledTopConsole = ({ playerID, ...rest }) => <Navbar {...rest} />

const StyledTopConsole = styled(_StyledTopConsole)`
  background-color: var(--black);
  padding: 4px 16px 0px 16px;
  z-index: 10;
  & button:focus,
  & button:hover {
    outline: 2px solid var(--white);
  }
  a {
    color: var(--player-color) !important ;
  }
  .navbar-toggler {
    color: var(--player-color) !important ;
    border-color: var(--player-color) !important ;
    padding: 0.25rem;
  }
  .dropdown-menu {
    background-color: var(--black);
  }
`
const StyledSpan = styled.span`
  svg rect {
    fill: var(--player-color);
    stroke: var(--player-color);
  }
`

const PlayerTeamLogo = ({ playerID, ...rest }) => {
  if (playerID === '0') {
    return (
      <PlayerTeamLogoImg src={beesBigLogo} alt="Bees team logo" {...rest} />
    )
  }
  if (playerID === '1') {
    return (
      <PlayerTeamLogoImg
        src={butterfliesLogo}
        alt="Butterflies team logo"
        {...rest}
      />
    )
  }
  return null
}

const PlayerTeamLogoImg = styled.img`
  height: 32px;
  width: auto;
`
