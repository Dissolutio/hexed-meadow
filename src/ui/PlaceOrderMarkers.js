import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'

export const PlaceOrderMarkers = () => {
  const { activateDataReadout, activateRollingInitiative } = useLayoutContext()
  const {
    playerID,
    currentPhase,
    orderMarkersReady,
    myCards,
    myOrderMarkers,
    confirmReady,
    placeOrderMarker,
  } = useBoardContext()

  useEffect(() => {
    if (currentPhase === 'rollingInitiative') {
      activateRollingInitiative()
    }
  }, [currentPhase])

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
const ArmyListStyle = styled.div`
  display: flex;
  flex-flow: column nowrap;
  color: var(--mainColor);
  h2 {
    font-size: 1.3rem;
    margin: 0;
    text-align: center;
  }
  button {
    color: var(--mainColor);
  }
  ul {
    display: flex;
    flex-flow: row wrap;
    flex-grow: 1;
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      padding: 0.3rem;
    }
  }
  button {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: center;
    background: var(--black);
    width: 100%;
    height: 100%;
    border: 0.1px solid var(--mainColor);
  }
  img {
    width: auto;
  }
  span {
    font-size: 1rem;
  }
`
