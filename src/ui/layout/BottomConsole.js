import React from 'react'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { DataReadout } from '../DataReadout'
import { PlacementControls } from '../PlacementControls'

export const BottomConsole = () => {
  const { layoutComponents, bottomConsoleComponent } = useLayoutContext()

  switch (bottomConsoleComponent) {
    case layoutComponents.dataReadout:
      return <DataReadout />
    case layoutComponents.placementArmy:
      return <PlacementControls />
    default:
      return null
  }
}
