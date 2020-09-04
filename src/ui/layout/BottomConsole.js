import React from 'react'
import { useLayoutContext } from 'ui/hooks'
import { DataReadout, PlacementControls, PlaceOrderMarkers, MyTurnUI } from 'ui'

export const BottomConsole = () => {
  const { layoutComponents, bottomConsoleComponent } = useLayoutContext()

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
