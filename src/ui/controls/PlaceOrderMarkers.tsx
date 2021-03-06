import React, { useState } from 'react'
import { useBoardContext } from 'ui/hooks'
import { ArmyListStyle } from 'ui/layout'

export const PlaceOrderMarkers = () => {
  const { playerID, G, myCards, myOrderMarkers, moves } = useBoardContext()
  const { currentRound, orderMarkersReady } = G
  const { confirmOrderMarkersReady, placeOrderMarker } = moves
  const [activeMarker, setActiveMarker] = useState('')
  const selectOrderMarker = (orderMarker) => {
    setActiveMarker(orderMarker)
  }
  const selectCard = (gameCardID) => {
    if (!activeMarker) return
    if (activeMarker) {
      placeOrderMarker({ playerID, orderMarker: activeMarker, gameCardID })
    }
  }
  // TODO use this instead for active style toggling within the styled component
  const selectedStyle = (orderMarker) => {
    if (activeMarker === orderMarker) {
      return {
        boxShadow: `1 1 2px var(--neon-green)`,
        border: `1px solid var(--neon-green)`,
      }
    } else {
      return {}
    }
  }
  const makeReady = () => {
    confirmOrderMarkersReady({ playerID })
  }
  const areAllOMsAssigned = !Object.values(myOrderMarkers).some(
    (om) => om === ''
  )
  const Content = () => {
    if (orderMarkersReady[playerID] === true) {
      return (
        <>
          <p>Waiting for opponents to finish placing order markers...</p>
        </>
      )
    }
    if (areAllOMsAssigned) {
      return (
        <>
          <p>Done placing your order markers?</p>
          <button onClick={makeReady}>CONFIRM DONE</button>
        </>
      )
    }
    return (
      <>
        <h2>{`Place your order markers for Round ${currentRound + 1}:`}</h2>
        <ul className="order-marker">
          {Object.keys(myOrderMarkers)
            .filter((om) => myOrderMarkers[om] === '')
            .map((om) => (
              <li
                key={om}
                onClick={() => selectOrderMarker(om)}
                style={selectedStyle(om)}
              >
                {om === 'X' ? om : (parseInt(om) + 1).toString()}
              </li>
            ))}
        </ul>
        <ul className="om-army-cards">
          {myCards.map((card) => (
            <li key={card.gameCardID}>
              <button
                // style={selectedStyle(card.gameCardID)}
                onClick={() => selectCard(card.gameCardID)}
              >
                <span>{card.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  }
  return (
    <ArmyListStyle>
      <Content />
    </ArmyListStyle>
  )
}
