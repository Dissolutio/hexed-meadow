import React from 'react'
import { useBoardContext } from 'ui/hooks'
import {
  PlacementControls,
  PlaceOrderMarkers,
  RoundOfPlayControls,
} from 'ui/controls'

export const BottomConsole = () => {
  const {
    playerID,
    isOrderMarkerPhase,
    isPlacementPhase,
    isRoundOfPlayPhase,
    isGameover,
    ctx,
  } = useBoardContext()
  const { gameover } = ctx
  if (isPlacementPhase) {
    return <PlacementControls />
  }
  if (isOrderMarkerPhase) {
    return <PlaceOrderMarkers />
  }
  if (isRoundOfPlayPhase) {
    return <RoundOfPlayControls />
  }
  if (isGameover) {
    const winnerID = gameover.winner
    if (winnerID === playerID) {
      return <h1>{`VICTORY!`}</h1>
    } else {
      return <h1>{`DEFEAT!`}</h1>
    }
  }
}