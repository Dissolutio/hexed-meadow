import React from 'react'
import styled from 'styled-components'
import { useBoardContext } from 'ui/hooks'
import { playerColorUrlEncoded } from 'app/theme'
import { contourLinesBG } from 'assets/contourLinesBG'

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
type LayoutContainerProps = {
  playerID: string
  bg: string
}
const LayoutContainer = styled.div<LayoutContainerProps>`
//🛠 SET CSS VARS
  --player-color:  ${(props) => props.theme.playerColors[props.playerID]};
  --navbar-height: 46px;
  --navbar-logo-height: 32px;
  
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  color: var(--player-color);
  background-image: url("${(props) => props.bg}");
`
const LayoutTop = styled.div`
  width: 100%;
  height: var(--navbar-height);
  background: var(--black);
`
const LayoutMiddle = styled.div`
  width: 100%;
  height: 50vh;
  position: relative;
  overflow: auto;
`
const LayoutBottom = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  min-height: calc(100vh - 50vh - var(--navbar-height));
  padding: 5px;
  margin: 0;
`
