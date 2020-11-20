import React from 'react'
import { useBoardContext } from 'ui/hooks'
import {
  RopIdleControls,
  RopMoveControls,
  RopAttackControls,
  PlacementControls,
  PlaceOrderMarkersControls,
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
    return <PlaceOrderMarkersControls />
  }
  if (isRoundOfPlayPhase) {
    if (!isMyTurn) {
      return <RopIdleControls />
    }
    if (isMyTurn && !isAttackingStage) {
      return <RopMoveControls />
    }
    if (isMyTurn && isAttackingStage) {
      return <RopAttackControls />
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
