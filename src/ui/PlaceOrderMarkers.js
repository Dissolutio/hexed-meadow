import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'
import { ArmyListStyle } from './layout/StyledComponents'

export const PlaceOrderMarkers = () => {
  const { activateDataReadout } = useLayoutContext()
  const {
    playerID,
    currentPhase,
    orderMarkersReady,
    myCards,
    myOrderMarkers,
    confirmReady,
    placeOrderMarker,
  } = useBoardContext()

  const [activeMarker, setActiveMarker] = useState('')

  const selectOrderMarker = (orderMarker) => {
    console.log('%c⧭', 'color: #994d75', orderMarker)
    setActiveMarker(orderMarker)
  }
  const selectCard = (gameCardID) => {
    if (!activeMarker) return
    if (activeMarker) {
      placeOrderMarker(playerID, activeMarker, gameCardID)
    }
  }
  const selectedStyle = (orderMarker) => {
    if (activeMarker === orderMarker) {
      return {
        boxShadow: `0 0 2px var(--neon-green)`,
      }
    } else {
      return {}
    }
  }

  const makeReady = () => {
    confirmReady(playerID)
  }
  if (orderMarkersReady[playerID] === true) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing order markers...</p>
      </ArmyListStyle>
    )
  }
  if (!Object.values(myOrderMarkers).some((om) => om === null)) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Done placing your order markers?</p>
        <button onClick={makeReady}>CONFIRM DONE</button>
      </ArmyListStyle>
    )
  }

  return (
    <ArmyListStyle playerID={playerID}>
      <h2>Place your Order Markers:</h2>
      <ul>
        {Object.keys(myOrderMarkers)
          .filter((om) => myOrderMarkers[om] === null)
          .map((om) => (
            <li
              key={om}
              onClick={() => selectOrderMarker(om)}
              style={selectedStyle(om)}
            >
              {om}
            </li>
          ))}
      </ul>
      <ul>
        {myCards.map((card) => (
          <li key={card.gameCardID}>
            <button
              style={selectedStyle(card.gameCardID)}
              onClick={() => selectCard(card.gameCardID)}
            >
              <span>{card.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </ArmyListStyle>
  )
}
