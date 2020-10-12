import React from 'react'
import { useBoardContext } from 'ui/hooks'
import { PlacementControls, PlaceOrderMarkers, RoundOfPlayControls } from 'ui'

export const BottomConsole = () => {
  const {
    isOrderMarkerPhase,
    isPlacementPhase,
    isRoundOfPlayPhase,
  } = useBoardContext()

  if (isPlacementPhase) {
    return <PlacementControls />
  }
  if (isOrderMarkerPhase) {
    return <PlaceOrderMarkers />
  }
  if (isRoundOfPlayPhase) {
    return <RoundOfPlayControls />
  }
}
