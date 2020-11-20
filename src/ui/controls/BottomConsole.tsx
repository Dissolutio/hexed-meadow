import React from 'react'
import { useBoardContext } from 'ui/hooks'
import {
  TheirMoveUI,
  MyMoveUI,
  MyAttackUI,
  PlacementControls,
  PlaceOrderMarkers,
} from 'ui/controls'

export const BottomConsole = () => {
  const {
    playerID,
    isOrderMarkerPhase,
    isPlacementPhase,
    isRoundOfPlayPhase,
    isMyTurn,
    isAttackingStage,
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
    if (!isMyTurn) {
      return <TheirMoveUI />
    }
    if (isMyTurn && !isAttackingStage) {
      return <MyMoveUI />
    }
    if (isMyTurn && isAttackingStage) {
      return <MyAttackUI />
    }
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
