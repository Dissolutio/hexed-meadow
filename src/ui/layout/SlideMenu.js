import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { useUIContext } from '../hooks/useUIContext'

export const SlideMenu = ({ playerID }) => {
  const { menuOpen, toggleMenu } = useUIContext()
  return (
    <MenuStyle onClick={toggleMenu} menuOpen={menuOpen} playerID={playerID}>
      <Link to="#">Home</Link>
      <Link to="#">Bogus Link</Link>
    </MenuStyle>
  )
}

const MenuStyle = styled.div`
  display: ${(props) => (props.menuOpen ? 'flex' : 'none')};
  position: fixed;
  width: 100%;
  min-height: 40vh;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
  background: var(--black);
  a,
  button {
    display: block;
    background: none;
    padding: 1rem;
    font-weight: 600;
    font-size: 1.6rem;
    border: none;
    box-shadow: none;
    text-decoration: none;
    color: ${(props) =>
      props.playerID === '0'
        ? `var(--bee-yellow);`
        : `var(--butterfly-purple);`};
    cursor: pointer;
    &:focus,
    &:active {
      outline: none;
      box-shadow: none;
    }
  }
  a.active-nav-link {
    font-weight: 800;
    text-decoration: none;
  }
`
