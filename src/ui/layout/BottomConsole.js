import React from 'react'
import styled from 'styled-components'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { DataReadout } from '../DataReadout'
import { PlacementControls } from '../PlacementControls'
import { PlaceOrderMarkers } from '../PlaceOrderMarkers'
import { MyTurnUI } from '../MyTurnUI'

export const BottomConsole = () => {
  const { layoutComponents, bottomConsoleComponent } = useLayoutContext()
  return (
    <Wrapper>
      <CurrentDisplay
        layoutComponents={layoutComponents}
        bottomConsoleComponent={bottomConsoleComponent}
      />
    </Wrapper>
  )
}

export const CurrentDisplay = ({
  layoutComponents,
  bottomConsoleComponent,
}) => {
  switch (bottomConsoleComponent) {
    case layoutComponents.dataReadout:
      return <DataReadout />
    case layoutComponents.placementArmy:
      return <PlacementControls />
    case layoutComponents.placeOrderMarkers:
      return <PlaceOrderMarkers />
    case layoutComponents.myTurnUI:
      return <MyTurnUI />
    default:
      return null
  }
}
const Wrapper = styled.div`
  box-sizing: content-box;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  padding: 5px;
  margin: 0;
`
const NavIconBar = () => {
  return (
    <StyledIconBarWrapper>
      <NavIcon></NavIcon>
    </StyledIconBarWrapper>
  )
}
const StyledIconBarWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 0;
  margin: 0;
  justify-content: start;
  align-items: stretch;
`
const NavIcon = styled.div`
  height: 50px;
  width: 50px;
  background-color: yellow;
`
