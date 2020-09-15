import React from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/esm/Button'

import { useBoardContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from './UnitIcon'
import { hexagonsHeroPatternDataUrl } from 'ui/layout/hexagonsHeroPatternDataUrl'
import { playerColorUrlEncoded } from './theme/theme'

export const RoundOfPlayControls = () => {
  const {
    // G
    armyCards,
    myCards,
    getGameCardByID,
    // CTX
    playerID,
    currentTurn,
    isMyTurn,
    hasConfirmedRoundOfPlayStart,
    isTakingTurnStage,
    isWatchingTurnStage,
    // MOVES
    confirmRoundOfPlayStartReady,
    endCurrentPlayerTurn,
  } = useBoardContext()
  const { selectedGameCardID, onSelectCard__turn } = useTurnContext()

  const hexagonBgDataUrl = hexagonsHeroPatternDataUrl({
    color: playerColorUrlEncoded(playerID),
    opacity: 0.05,
  })
  const handleArmyCardClick = ({ event = null, gameCardID = '' }) => {
    onSelectCard__turn(gameCardID)
  }
  const isCurrentSelectedCard = (gameCardID) => {
    return gameCardID === selectedGameCardID
  }
  // CONFIRM MY TURN / THEIR TURN
  if (!hasConfirmedRoundOfPlayStart) {
    return <ConfirmReadyRoundOfPlay />
  }

  // RETURN THEIR TURN UI
  if (isWatchingTurnStage) {
    return (
      <StyledWrapper playerID={playerID}>
        <h2>Opponent taking turn...</h2>
      </StyledWrapper>
    )
  }

  // RETURN MY TURN UI
  if (isTakingTurnStage) {
    return (
      <StyledWrapper playerID={playerID}>
        <h2>{`Your #${currentTurn}`}</h2>
        <PlayerCardsStyledUL>
          {myCards.map((card) => (
            <PlayerCardStyledLi
              onClick={(e) =>
                handleArmyCardClick({ event: e, gameCardID: card.gameCardID })
              }
              id={`mtui-${card.gameCardID}`}
              key={card.gameCardID}
              playerID={card.playerID}
              bg={hexagonBgDataUrl}
              isCurrentSelectedCard={isCurrentSelectedCard(card.gameCardID)}
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
            </PlayerCardStyledLi>
          ))}
        </PlayerCardsStyledUL>
        <Button variant="primary" onClick={() => endCurrentPlayerTurn()}>
          END TURN
        </Button>
      </StyledWrapper>
    )
  }
}

const ConfirmReadyRoundOfPlay = () => {
  const { playerID, isMyTurn, confirmRoundOfPlayStartReady } = useBoardContext()
  const handleReadyClick = () => {
    confirmRoundOfPlayStartReady({ playerID })
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
