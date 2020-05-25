import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'
import { UnitIcon } from './UnitIcon'

export const MyTurnUI = () => {
  const { activateDataReadout } = useLayoutContext()
  const {
    playerID,
    currentPhase,
    orderMarker1Ready,
    activePlayers,
    myCards,
    confirmReady,
    ctx,
    activeGameCardID,
    setActiveGameCardID,
  } = useBoardContext()

  console.log('%c⧭', 'color: #8c0038', activePlayers)
  const selectedStyle = (gameCardID) => {
    if (gameCardID === activeGameCardID) {
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

  if (orderMarker1Ready[playerID] === true) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing armies...</p>
      </ArmyListStyle>
    )
  }
  if (myCards.length === 0) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Done moving your units?</p>
        <button onClick={makeReady}>CONFIRM PLACEMENT</button>
      </ArmyListStyle>
    )
  }

  console.log('%c⧭', 'color: #00736b', myCards)
  return (
    <ArmyListStyle playerID={playerID}>
      <button onClick={activateDataReadout}>Data Readout</button>
      <ul>
        {myCards.map((card) => (
          <li key={card.gameCardID}>
            <button
              style={selectedStyle(card.gameCardID)}
              onClick={() => setActiveGameCardID(card.cardID)}
            >
              <UnitIcon
                card={card}
                iconProps={{
                  x: '50',
                  y: '50',
                  transform: '',
                }}
              />
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
