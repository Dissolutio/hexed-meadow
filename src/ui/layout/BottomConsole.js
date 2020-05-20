import React from 'react'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { DataReadout } from '../DataReadout'
import { PlacementControls } from '../PlacementControls'
import { PlaceOrderMarkers } from '../PlaceOrderMarkers'

export const BottomConsole = () => {
  const { layoutComponents, bottomConsoleComponent } = useLayoutContext()
  switch (bottomConsoleComponent) {
    case layoutComponents.dataReadout:
      return <DataReadout />
    case layoutComponents.placementArmy:
      return <PlacementControls />
    case layoutComponents.placeOrderMarkers:
      return <PlaceOrderMarkers />
    default:
      return null
  }
}
