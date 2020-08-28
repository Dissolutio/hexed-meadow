import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import useOnClickOutside from 'use-onclickoutside'

import { useBoardContext, useUIContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from './UnitIcon'

export const MyTurnUI = () => {
  const { myCards } = useBoardContext()
  const { playerColor } = useUIContext()
  const { selectedGameCardID } = useTurnContext()
  const [focusedCardID, setFocusedCardID] = React.useState('')
  const [target, setTarget] = useState(null)
  const ref = useRef(null)

  const handleArmyCardClick = ({ event = null, gameCardID = '' }) => {
    if (gameCardID === focusedCardID) {
      setFocusedCardID('')
    } else {
      setFocusedCardID(gameCardID)
      setTarget(document.getElementById(`mtui-${gameCardID}`))
    }
  }
  useOnClickOutside(ref, handleArmyCardClick)

  const selectedStyle = (gameCardID) => {
    return gameCardID === selectedGameCardID
      ? {
          boxShadow: `1px 1px 2px var(--neon-green), 1px 1px 2px var(--neon-green) inset`,
        }
      : {}
  }
  const popover = () => {
    return (
      <Popover style={{ width: '100%' }}>
        <Popover.Title as="h3">Popover bottom</Popover.Title>
        <Popover.Content>
          <strong>Holy guacamole!</strong> Check this info.
        </Popover.Content>
      </Popover>
    )
  }
  return (
    <StyledWrapper playerColor={playerColor}>
      <PlayerCardsStyledUL ref={ref}>
        {myCards.map((card) => (
          <PlayerCardStyledLi
            onClick={(e) =>
              handleArmyCardClick({ event: e, gameCardID: card.gameCardID })
            }
            id={`mtui-${card.gameCardID}`}
            key={card.gameCardID}
            playerColor={playerColor}
            style={{ ...selectedStyle(card.gameCardID) }}
          >
            <UnitIcon
              card={card}
              iconProps={{
                x: '50',
                y: '50',
                transform: '',
              }}
            />
            <div>{card.name}</div>
            <Overlay
              show={Boolean(focusedCardID)}
              target={target}
              placement="bottom-start"
              container={ref.current}
              containerPadding={20}
            >
              {popover()}
            </Overlay>
          </PlayerCardStyledLi>
        ))}
      </PlayerCardsStyledUL>
    </StyledWrapper>
  )
}
const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  color: ${(props) => props.playerColor};
  button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.2) inset;
  }
`
const PlayerCardsStyledUL = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  flex-grow: 1;
  list-style-type: none;
  margin: 0;
  padding: 0;
  li {
    padding: 0.3rem;
    margin: 0.3rem;
  }
`
const PlayerCardStyledLi = styled.li`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
  color: ${(props) => props.playerColor};
  border: 0.1px solid ${(props) => props.playerColor};
  color: ${(props) => props.playerColor};
  background-color: var(--black);
`
