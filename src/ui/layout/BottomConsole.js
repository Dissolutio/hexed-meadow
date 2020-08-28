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
    <CurrentDisplay
      layoutComponents={layoutComponents}
      bottomConsoleComponent={bottomConsoleComponent}
    />
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
