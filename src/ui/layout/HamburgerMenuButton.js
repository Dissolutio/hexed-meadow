import React from 'react'
import styled from 'styled-components'
import { useUIContext } from '../hooks/useUIContext'

export const HamburgerMenuButton = () => {
  const { playerID, menuOpen, toggleMenu } = useUIContext()
  return (
    <Wrapper onClick={toggleMenu} pID={playerID}>
      <div className={menuOpen ? 'open' : ''}>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --thickness: 0.19rem;
  --width: 1.75rem;
  --margin: 0.2rem;
  --top: 0.35rem;
  --top-negative: -0.35rem;
  @media only screen and (min-width: 600px) {
    --thickness: 0.25rem;
    --width: 2.5rem;
    --margin: 0.4rem;
    --top: 0.6rem;
    --top-negative: -0.6rem;
  }

  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: auto 1rem;
  /* max-height: 50%; */
  border: var(--thickness) solid
    var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
  border-radius: 5px;
  cursor: pointer;
  div {
    span {
      background-color: ${(props) =>
        `${
          props.pID === '0' ? 'var(--bee-yellow)' : 'var(--butterfly-purple)'
        }`};
      display: block;
      position: relative;
      width: var(--width);
      height: var(--thickness);
      margin: var(--margin);
      border-radius: 5px;
      transition: all ease-in-out 0.2s;
    }
  }
  .open span:nth-child(2) {
    opacity: 0;
  }

  .open span:nth-child(3) {
    transform: rotate(45deg);
    top: var(--top-negative);
  }

  .open span:nth-child(1) {
    transform: rotate(-45deg);
    top: var(--top);
  }
`
