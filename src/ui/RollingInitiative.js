import React, { useEffect } from 'react'
import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'

export const RollingInitiative = () => {
  const { activateMyTurnUI } = useLayoutContext()
  const {
    playerID,
    currentPhase,
    initiativeReady,
    confirmReady,
    initiative,
  } = useBoardContext()

  useEffect(() => {
    if (currentPhase === 'orderMarker1') {
      activateMyTurnUI()
    }
  }, [currentPhase])

  const makeReady = () => {
    confirmReady(playerID)
  }

  if (initiativeReady[playerID] === true) {
    return <p>Waiting for opponents to acknowledge initiative...</p>
  }

  const InitiativeInform = () => {
    if (initiative.indexOf(parseInt(playerID)) === 0) {
      return <div>YOU ARE FIRST</div>
    }
    if (initiative.indexOf(parseInt(playerID)) === 1) {
      return <div>YOU ARE SECOND</div>
    }
  }
  return (
    <>
      <InitiativeInform />
      <button onClick={makeReady}>OKIE DOKIE</button>
    </>
  )
}
