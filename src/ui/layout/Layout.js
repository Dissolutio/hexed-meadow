import React from 'react'
import styled from 'styled-components'
import { useUIContext } from 'ui/hooks/useUIContext'
import { useWindowDimensions } from 'ui/hooks/useWindowDimensions'

export const Layout = ({ children }) => {
  const { playerID, playerColor } = useUIContext()
  const pClass = `board-${playerID}`
  const { windowDimensions, viewportSize } = useWindowDimensions()

  return (
    <>
      <LayoutContainer playerColor={playerColor} className={`${pClass}`}>
        <LayoutTop>{children[0]}</LayoutTop>
        <LayoutMiddle
          windowDimensions={windowDimensions}
          className={`${pClass}`}
        >
          {children[1]}
        </LayoutMiddle>
        <LayoutBottom>{children[2]}</LayoutBottom>
      </LayoutContainer>
    </>
  )
}

const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  color: ${(props) => props.playerColor};
  background: radial-gradient(
      ellipse at top,
      ${(props) => props.playerColor},
      transparent
    ),
    radial-gradient(ellipse at bottom, var(--black), transparent);
`
const LayoutTop = styled.div`
  width: 100%;
  height: 5vh;
  background: var(--black);
`
const LayoutBottom = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  min-height: 30vh;
  background: var(--black);
  padding: 5px;
  margin: 0;
`
const LayoutMiddle = styled.div`
  width: 100%;
  @media screen and (min-width: 900px) {
    box-sizing: content-box;
    width: 50%;
    padding-left: 20%;
    padding-right: 20%;
  }
  height: 65vh;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0.5rem;
    background: var(--black);
  }
  &::-webkit-scrollbar-track-piece {
    border-radius: 10px;
    box-shadow: inset 0 0 5px ${(props) => props.playerColor};
    width: 0.5rem;
  }
  &::-webkit-scrollbar-corner {
    background: var(--black);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${(props) => props.playerColor};
  }
`
