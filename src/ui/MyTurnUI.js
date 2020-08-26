import React from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import {
  useBoardContext,
  useLayoutContext,
  useUIContext,
  useTurnContext,
} from 'ui/hooks'
import { UnitIcon } from './UnitIcon'
import { ArmyListStyle } from './layout/ArmyListStyle'

export const MyTurnUI = () => {
  const {
    playerID,
    activeUnit,
    activeUnitID,
    setActiveUnitID,
    currentTurnGameCardID,
    currentTurnGameCard,
    myCards,
    activeGameCardID,
    setActiveGameCardID,
  } = useBoardContext()
  const { playerColor } = useUIContext()
  const {
    onClickUnit__turn,
    onSelectCard__turn,
    selectedGameCard,
    selectedGameCardID,
  } = useTurnContext()
  console.log(`MyTurnUI -> currentTurnGameCardID`, currentTurnGameCardID)
  console.log(`MyTurnUI -> currentTurnGameCard`, currentTurnGameCard)
  console.log(`MyTurnUI -> selectedGameCard`, selectedGameCard)
  console.log(`MyTurnUI -> selectedGameCardID`, selectedGameCardID)

  const selectedStyle = (gameCardID) => {
    return gameCardID === selectedGameCardID
      ? {
          boxShadow: `1px 1px 2px var(--neon-green)`,
        }
      : {}
  }
  return (
    <ArmyListStyle playerColor={playerColor}>
      <ul>
        {myCards.map((card) => (
          <li key={card.gameCardID}>
            <button
              style={selectedStyle(card.gameCardID)}
              onClick={() => onSelectCard__turn(card.gameCardID)}
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
