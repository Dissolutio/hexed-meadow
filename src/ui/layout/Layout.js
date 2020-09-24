import React from 'react'
import styled from 'styled-components'
import { useBoardContext } from 'ui/hooks'
import { playerColorUrlEncoded } from 'ui/theme/theme'
import { contourLinesBG } from './contourLinesBG'

export const Layout = ({ children }) => {
  const { playerID } = useBoardContext()
  const contourLinesBgDataUrlStr = contourLinesBG({
    color: playerColorUrlEncoded(playerID),
  })

  return (
    <>
      <LayoutContainer
        id={`player${playerID}`} // for linking to this player view (useful in local dev)
        bg={contourLinesBgDataUrlStr}
        playerID={playerID}
      >
        <LayoutTop>{children[0]}</LayoutTop>
        <LayoutMiddle>{children[1]}</LayoutMiddle>
        <LayoutBottom>{children[2]}</LayoutBottom>
      </LayoutContainer>
    </>
  )
}

const LayoutContainer = styled.div`
//🛠 SET PLAYER THEME COLOR
  --player-color:  ${(props) => props.theme.playerColors[props.playerID]};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  color: var(--player-color);
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
  height: 55vh;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
    background: var(--black);
  }
  &::-webkit-scrollbar-track-piece {
    border-radius: 10px;
    box-shadow: inset 0 0 5px var(--player-color);
    width: 0.5rem;
  }
  &::-webkit-scrollbar-corner {
    background: var(--black);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--player-color);
  }
`
