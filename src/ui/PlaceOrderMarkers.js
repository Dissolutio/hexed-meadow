import React, { useState } from 'react'
import styled from 'styled-components'

import { useBoardContext } from './hooks/useBoardContext'
import { usePlacementContext } from './hooks/usePlacementContext'
import { useLayoutContext } from './hooks/useLayoutContext'

import { UnitIcon } from './UnitIcon'

export const PlaceOrderMarkers = () => {
  const { activateDataReadout } = useLayoutContext()
  const {
    playerID,
    playersReady,
    confirmReady,
    activeGameCardID,
    setActiveGameCardID,
    myCards,
  } = useBoardContext()

  const [myOrderMarkers, setMyOrderMarkers] = useState({
    '1': null,
    '2': null,
    '3': null,
    X: null,
  })

  const selectedStyle = (gameCardID) => {
    if (activeGameCardID === gameCardID) {
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
  if (playersReady[playerID] === true) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing order markers...</p>
      </ArmyListStyle>
    )
  }
  if (
    myOrderMarkers['1'] &&
    myOrderMarkers['2'] &&
    myOrderMarkers['3'] &&
    myOrderMarkers['X']
  ) {
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
      <p>Select a marker, then select the card to place it on.</p>
      <ul>
        {myCards.map((card) => (
          <li key={card.gameCardID}>
            <button
              style={selectedStyle(card.gameCardID)}
              onClick={() => setActiveGameCardID(card.gameCardID)}
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
