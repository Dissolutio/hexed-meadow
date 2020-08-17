import React from 'react'

import { useBoardContext } from './hooks/useBoardContext'
import { useLayoutContext } from './hooks/useLayoutContext'
import { UnitIcon } from './UnitIcon'
import { ArmyListStyle } from './layout/StyledComponents'

export const MyTurnUI = () => {
  const {
    playerID,
    myCards,
    activeGameCardID,
    setActiveGameCardID,
  } = useBoardContext()

  const selectedStyle = (gameCardID) => {
    return gameCardID === activeGameCardID
      ? {
          boxShadow: `0 0 2px var(--neon-green)`,
        }
      : {}
  }

  return (
    <ArmyListStyle playerID={playerID}>
      
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
