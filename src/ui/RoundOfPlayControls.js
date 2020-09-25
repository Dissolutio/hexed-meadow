import React from 'react'
import { BsArrowCounterclockwise, BsArrowClockwise } from 'react-icons/bs'
import styled from 'styled-components'
import Button from 'react-bootstrap/esm/Button'

import { useBoardContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from './UnitIcon'
import { hexagonsHeroPatternDataUrl } from 'ui/layout/hexagonsHeroPatternDataUrl'
import { playerColorUrlEncoded } from './theme/theme'

export const RoundOfPlayControls = () => {
  const {
    // G
    myCards,
    currentOrderMarker,
    currentTurnGameCardID,
    hasConfirmedRoundOfPlayStart,
    isMyTurn,
    // CTX
    playerID,
    undo,
    redo,
    // MOVES
    endCurrentPlayerTurn,
  } = useBoardContext()

  const { selectedGameCardID, onSelectCard__turn } = useTurnContext()
  const myTurnCards = () => {
    const clone = [...myCards]
    const activeTurnCards = clone.filter((card) => isCurrentTurnCard(card))
    const nonActiveTurnCards = clone.filter((card) => !isCurrentTurnCard(card))
    const adjustedArr = [...activeTurnCards, ...nonActiveTurnCards]
    return adjustedArr
  }
  const hexagonBgDataUrl = hexagonsHeroPatternDataUrl({
    color: playerColorUrlEncoded(playerID),
    opacity: 0.05,
  })
  const isCurrentSelectedCard = (card) => {
    return card?.gameCardID === selectedGameCardID
  }
  const isCurrentTurnCard = (card) => {
    return card?.gameCardID === currentTurnGameCardID
  }

  //! handlers
  const handleArmyCardClick = ({ event = null, gameCardID = '' }) => {
    onSelectCard__turn(gameCardID)
  }
  const handleEndTurnButtonClick = () => {
    endCurrentPlayerTurn()
  }

  //! RETURN CONFIRM
  if (!hasConfirmedRoundOfPlayStart) {
    return <ConfirmReadyRoundOfPlay />
  }

  //! RETURN WATCHING TURN
  if (!isMyTurn) {
    return (
      <StyledWrapper playerID={playerID}>
        <h2>Opponent taking turn...</h2>
      </StyledWrapper>
    )
  }

  //! RETURN TAKING TURN
  if (isMyTurn) {
    return (
      <StyledWrapper playerID={playerID}>
        <h2>{`Your #${currentOrderMarker + 1}:`}</h2>
        <PlayerCardsStyledUL>
          {myTurnCards().map((card) => (
            <PlayerCardStyledLi
              onClick={(e) =>
                handleArmyCardClick({ event: e, gameCardID: card.gameCardID })
              }
              id={`mtui-${card.gameCardID}`}
              key={card.gameCardID}
              playerID={card.playerID}
              bg={hexagonBgDataUrl}
              isCurrentSelectedCard={isCurrentSelectedCard(card)}
            >
              <UnitIcon
                cardID={card.cardID}
                iconPlayerID={card.playerID}
                iconProps={{
                  x: '50',
                  y: '50',
                  transform: '',
                }}
              />
              <div>{card.name}</div>
            </PlayerCardStyledLi>
          ))}
        </PlayerCardsStyledUL>
        <ButtonWrapper>
          <Button variant="danger" onClick={handleEndTurnButtonClick}>
            END MOVE
          </Button>
          <span>
            <Button variant="secondary" onClick={() => undo()}>
              <MiniButton>
                <BsArrowCounterclockwise style={{ marginRight: '1rem' }} />
                <span>UNDO</span>
              </MiniButton>
            </Button>
            <Button variant="secondary" onClick={redo}>
              <BsArrowClockwise style={{ marginRight: '1rem' }} />
              REDO
            </Button>
          </span>
        </ButtonWrapper>
      </StyledWrapper>
    )
  }
}

const ConfirmReadyRoundOfPlay = () => {
  const { playerID, isMyTurn, confirmRoundOfPlayStartReady } = useBoardContext()
  const handleReadyClick = () => {
    confirmRoundOfPlayStartReady()
  }
  if (isMyTurn) {
    return (
      <StyledWrapper playerID={playerID}>
        <h1>YOUR TURN!</h1>
        <Button variant="primary" onClick={handleReadyClick}>
          LET'S DO THIS
        </Button>
      </StyledWrapper>
    )
  } else {
    return (
      <StyledWrapper playerID={playerID}>
        <h1>THEIR TURN!</h1>
        <Button variant="primary" onClick={handleReadyClick}>
          BIG WHOOP!
        </Button>
      </StyledWrapper>
    )
  }
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.playerColors[props.playerID]};
  button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.2) inset;
  }
`
const PlayerCardsStyledUL = styled.ul`
  display: flex;
  flex-flow: column nowrap;
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
  color: ${(props) => props.theme.playerColors[props.playerID]};
  border: 0.1px solid ${(props) => props.theme.playerColors[props.playerID]};
  color: ${(props) => props.theme.playerColors[props.playerID]};
  background-image: url("${(props) => props.bg}");
  box-shadow: ${(props) =>
    props.isCurrentSelectedCard
      ? `1px 1px 2px var(--white), 1px 1px 2px var(--white) inset`
      : `none`};
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 26px;
`
const MiniButton = styled.div`
  button {
  }
  span {
  }
`
