import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { useUIContext } from 'ui/hooks/useUIContext'
import beesBigLogo from 'assets/beesBigLogo.png'
import butterfliesLogo from 'assets/butterfliesLogo.png'

export const AppNavbar = () => {
  const { playerID, playerColor } = useUIContext()
  return (
    <StyledTopConsole playerColor={playerColor} collapseOnSelect expand="lg">
      <Navbar.Brand href="#home">
        <PlayerTeamLogo
          playerID={playerID}
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        label="Toggle navigation"
      >
        <span>
          <svg viewBox="0 0 100 70" width="20" height="20">
            <rect
              width="100"
              height="10"
              rx="8"
              fill={playerColor}
              strokeWidth="1"
              stroke={playerColor}
            />
            <rect
              y="30"
              width="100"
              height="10"
              rx="8"
              fill={playerColor}
              strokeWidth="1"
              stroke={playerColor}
            />
            <rect
              y="60"
              width="100"
              height="10"
              rx="8"
              fill={playerColor}
              strokeWidth="1"
              stroke={playerColor}
            />
          </svg>
        </span>
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/team0">
            Bees
          </Nav.Link>
          <Nav.Link as={Link} to="/team1">
            Butterflies
          </Nav.Link>
          <NavDropdown title="Opponents" id="collasible-nav-dropdown">
            <NavDropdown.Item as={Link} to="/team0">
              Bees
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/team1">
              Butterflies
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/">
              Homepage
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </StyledTopConsole>
  )
}

const StyledTopConsole = styled(({ playerColor, ...rest }) => (
  <Navbar {...rest} />
))`
  background-color: var(--black);
  padding: 4px 16px 0px 16px;
  & button:focus {
    outline: 2px solid --pinkish-white;
  }
  & button:hover {
    outline: 2x solid --pinkish-white;
  }
  a {
    color: ${(props) => props.playerColor} !important ;
  }
  .navbar-toggler {
    color: ${(props) => props.playerColor} !important ;
    border-color: ${(props) => props.playerColor} !important ;
    padding: 0.25rem;
  }
  .dropdown-menu {
    background-color: var(--black);
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
