import React from 'react'
import styled from 'styled-components'
import { useUIContext } from 'ui/hooks/useUIContext'
import { contourLinesBG } from './contourLinesBG'

export const Layout = ({ children }) => {
  const { playerID, playerColor, playerColorUrlEncoded } = useUIContext()
  const bgSvg = contourLinesBG(playerColorUrlEncoded)
  return (
    <>
      <LayoutContainer
        id={`player${playerID}`}
        bg={bgSvg}
        playerColor={playerColor}
      >
        <LayoutTop>{children[0]}</LayoutTop>
        <LayoutMiddle playerColor={playerColor}>{children[1]}</LayoutMiddle>
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
  background-color: var(--gunmetal);
  background-image: url("${(props) => props.bg}");
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
  min-height: 40vh;
  background: var(--black);
  padding: 5px;
  margin: 0;
`
const LayoutMiddle = styled.div`
  width: 100%;
  /* @media screen and (min-width: 900px) {
    box-sizing: content-box;
    width: 50%;
    padding-left: 20%;
    padding-right: 20%;
  } */
  height: 55vh;
  overflow: auto;
  padding: 50px 0px;

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
