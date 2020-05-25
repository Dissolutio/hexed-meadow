import React, { useEffect } from 'react'
import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'

export const MyTurnUI = () => {
  const { activateMyTurnUI } = useLayoutContext()
  const {
    playerID,
    currentPhase,
    playersReady,
    confirmReady,
    ctx,
  } = useBoardContext()

  console.log('%c⧭', 'color: #364cd9', currentPhase)
  console.log('%c⧭', 'color: #ffa280', ctx)

  return <div>MY TURN UI</div>
}
