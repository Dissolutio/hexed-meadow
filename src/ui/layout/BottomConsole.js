import React from 'react'
import { useLayoutContext } from 'ui/hooks'
import {
  DataReadout,
  PlacementControls,
  PlaceOrderMarkers,
  RoundOfPlayControls,
} from 'ui'

export const BottomConsole = () => {
  const { layoutComponents, bottomConsoleComponent } = useLayoutContext()

  switch (bottomConsoleComponent) {
    case layoutComponents.dataReadout:
      return <DataReadout />
    case layoutComponents.placementArmy:
      return <PlacementControls />
    case layoutComponents.placeOrderMarkers:
      return <PlaceOrderMarkers />
    case layoutComponents.roundOfPlayControls:
      return <RoundOfPlayControls />
    default:
      return null
  }
}
