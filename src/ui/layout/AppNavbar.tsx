import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { GiSabersChoc } from 'react-icons/gi'
import { useBoardContext } from 'ui/hooks'
import beesBigLogo from 'assets/beesBigLogo.png'
import butterfliesLogo from 'assets/butterfliesLogo.png'
import { playerIconColors } from 'ui/UnitIcon'

export const AppNavbar = () => {
  const boardState: any = useBoardContext()
  const playerID = boardState?.playerID
  const opponentPlayerID = playerID === '0' ? '1' : '0'
  const gameIconProps = {
    style: {
      fill: `${playerIconColors[playerID]}`,
      fontSize: `30px`,
    },
  }
  return (
    <StyledTopConsole collapseOnSelect expand="lg" playerID={playerID}>
      <div>
        <Navbar.Brand href={`/#player${playerID}`}>
          <PlayerTeamLogo
            playerID={playerID}
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <VersusStyledSpan playerID={playerID}>
          <GiSabersChoc {...gameIconProps} />
        </VersusStyledSpan>
        <Navbar.Brand href={`/#player${opponentPlayerID}`}>
          <PlayerTeamLogo
            playerID={opponentPlayerID}
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
      </div>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        label="Toggle navigation"
      >
        <StyledSpan playerID={playerID}>
          <svg viewBox="0 0 100 70" width="20" height="20">
            <rect width="100" height="10" rx="8" strokeWidth="1" />
            <rect y="30" width="100" height="10" rx="8" strokeWidth="1" />
            <rect y="60" width="100" height="10" rx="8" strokeWidth="1" />
          </svg>
        </StyledSpan>
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href={`#player${playerID}`}>US</Nav.Link>
          <Nav.Link href={`#player${opponentPlayerID}`}>THEM</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </StyledTopConsole>
  )
}

const StyledTopConsole = styled(({ playerID, ...rest }) => (
  <Navbar {...rest} />
))`
  background-color: var(--black);
  padding: 4px 16px 0px 16px;
  & button:focus,
  & button:hover {
    outline: 2px solid --white-btn-outline;
  }
  a {
    color: ${(props) => props.theme.playerColors[props.playerID]} !important ;
  }
  .navbar-toggler {
    color: ${(props) => props.theme.playerColors[props.playerID]} !important ;
    border-color: ${(props) =>
      props.theme.playerColors[props.playerID]} !important ;
    padding: 0.25rem;import { playerIconColors } from '../UnitIcon';

  }
  .dropdown-menu {
    background-color: var(--black);
  }
`
const StyledSpan = styled.span`
  svg rect {
    fill: ${(props) => props.theme.playerColors[props.playerID]};
    stroke: ${(props) => props.theme.playerColors[props.playerID]};
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
const VersusStyledSpan = styled.span`
  color: ${(props) => props.theme.playerColors[props.playerID]};
  padding: 0 10px 0 0px;
`
