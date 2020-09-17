import React, { useState } from 'react'
import { useBoardContext, useLayoutContext } from 'ui/hooks'
import { ArmyListStyle } from 'ui/layout/ArmyListStyle'

export const PlaceOrderMarkers = () => {
  const { activateDataReadout } = useLayoutContext()
  const {
    playerID,
    orderMarkersReady,
    myCards,
    myOrderMarkers,
    confirmOrderMarkersReady,
    placeOrderMarker,
  } = useBoardContext()
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
  const isCurrentSelectedOrderMarker = (orderMarker) => {
    return activeMarker === orderMarker
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
    confirmOrderMarkersReady({ playerID })
  }
  const areAllOMsAssigned = !Object.values(myOrderMarkers).some(
    (om) => om === ''
  )

  if (orderMarkersReady[playerID] === true) {
    return (
      <ArmyListStyle playerID={playerID}>
        <button onClick={activateDataReadout}>Data Readout</button>
        <p>Waiting for opponents to finish placing order markers...</p>
      </ArmyListStyle>
    )
  }
  if (areAllOMsAssigned) {
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
