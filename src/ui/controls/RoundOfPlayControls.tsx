import React from 'react'
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from 'react-icons/hi'

import styled from 'styled-components'
import Button from 'react-bootstrap/esm/Button'

import { useBoardContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from '../icons/UnitIcon'
import { hexagonsHeroPatternDataUrl } from 'assets/hexagonsHeroPatternDataUrl'
import { playerColorUrlEncoded } from 'app/theme'

export const TheirMoveUI = () => {
  const { G, playerID } = useBoardContext()
  const { currentOrderMarker } = G
  const { revealedGameCard } = useTurnContext()
  return (
    <StyledWrapper playerID={playerID}>
      <h2>
        {`Opponent's #${currentOrderMarker + 1} is ${
          revealedGameCard?.name ?? '...'
        }`}
      </h2>
    </StyledWrapper>
  )
}

export const MyMoveUI = () => {
  const {
    G,
    ctx,
    moves,
    playerID,
    // computed
    myCards,
  } = useBoardContext()

  const {
    selectedGameCardID,
    currentTurnGameCardID,
    revealedGameCard,
    onSelectCard__turn,
  } = useTurnContext()

  const { unitsMoved, currentOrderMarker } = G
  const { undo, redo } = ctx
  const { endCurrentMoveStage } = moves

  const hexagonBgDataUrl = hexagonsHeroPatternDataUrl({
    color: playerColorUrlEncoded(playerID),
    opacity: 0.05,
  })

  //! handlers
  const handleArmyCardClick = (gameCardID) => {
    onSelectCard__turn(gameCardID)
  }
  const handleEndMovementClick = () => {
    endCurrentMoveStage()
  }

  const myTurnCards = () => {
    const isCurrentTurnCard = (card) => {
      return card?.gameCardID === currentTurnGameCardID
    }
    //🛠 sort active card to top
    const clone = [...myCards]
    const thisTurnCard = clone.find((card) => isCurrentTurnCard(card))
    const nonActiveTurnCards = clone.filter((card) => !isCurrentTurnCard(card))
    return [thisTurnCard, ...nonActiveTurnCards]
  }

  const isCurrentSelectedCard = (card) => {
    return card?.gameCardID === selectedGameCardID
  }
  return (
    <StyledWrapper playerID={playerID}>
      <h2>{`Your #${currentOrderMarker + 1}: ${
        revealedGameCard?.name ?? ''
      }`}</h2>
      <p>
        You have moved {unitsMoved.length} / {revealedGameCard?.figures ?? 0}{' '}
        units{' '}
      </p>
      <PlayerCardsStyledUL>
        <ButtonWrapper>
          <Button variant="danger" onClick={handleEndMovementClick}>
            END MOVE
          </Button>
          <span>
            <Button variant="secondary" onClick={() => undo()}>
              <HiOutlineArrowCircleLeft />
              <span>UNDO</span>
            </Button>
            <Button variant="secondary" onClick={redo}>
              <HiOutlineArrowCircleRight />
              REDO
            </Button>
          </span>
        </ButtonWrapper>
        {myTurnCards().map((card) => (
          <PlayerCardStyledLi
            onClick={() => handleArmyCardClick(card.gameCardID)}
            id={`mtui-${card.gameCardID}`}
            key={card.gameCardID}
            bg={hexagonBgDataUrl}
            isCurrentSelectedCard={isCurrentSelectedCard(card)}
          >
            <UnitIcon
              cardID={card.cardID}
              iconPlayerID={card.playerID}
              iconProps={{
                x: '50',
                y: '50',
              }}
            />
            <div>{card.name}</div>
          </PlayerCardStyledLi>
        ))}
      </PlayerCardsStyledUL>
    </StyledWrapper>
  )
}

export const MyAttackUI = () => {
  const {
    G,
    moves,
    playerID,
    // computed
    myCards,
    currentTurnGameCardID,
  } = useBoardContext()
  const { endCurrentPlayerTurn } = moves
  const { unitsAttacked, currentOrderMarker } = G

  const {
    selectedGameCardID,
    revealedGameCard,
    onSelectCard__turn,
  } = useTurnContext()

  const hexagonBgDataUrl = hexagonsHeroPatternDataUrl({
    color: playerColorUrlEncoded(playerID),
    opacity: 0.05,
  })

  const handleEndTurnButtonClick = () => {
    endCurrentPlayerTurn()
  }
  const handleArmyCardClick = (gameCardID) => {
    onSelectCard__turn(gameCardID)
  }
  const isCurrentSelectedCard = (card) => {
    return card?.gameCardID === selectedGameCardID
  }
  const myTurnCards = () => {
    const isCurrentTurnCard = (card) => {
      return card?.gameCardID === currentTurnGameCardID
    }
    //🛠 sort active card to top
    const clone = [...myCards]
    const myActiveCard = clone.find((card) => isCurrentTurnCard(card))
    const myInactiveCards = clone.filter((card) => !isCurrentTurnCard(card))
    return [myActiveCard, ...myInactiveCards]
  }

  return (
    <StyledWrapper playerID={playerID}>
      <h2>{`Your #${currentOrderMarker + 1}: ${
        revealedGameCard?.name ?? ''
      }`}</h2>
      <p>
        You have used {unitsAttacked.length} / {revealedGameCard?.figures ?? 0}{' '}
        attacks{' '}
      </p>
      <PlayerCardsStyledUL>
        <ButtonWrapper>
          <Button variant="danger" onClick={handleEndTurnButtonClick}>
            END TURN
          </Button>
        </ButtonWrapper>
        {myTurnCards().map((card) => (
          <PlayerCardStyledLi
            onClick={() => handleArmyCardClick(card.gameCardID)}
            id={`mtui-${card.gameCardID}`}
            key={card.gameCardID}
            bg={hexagonBgDataUrl}
            isCurrentSelectedCard={isCurrentSelectedCard(card)}
          >
            <UnitIcon
              cardID={card.cardID}
              iconPlayerID={card.playerID}
              iconProps={{
                x: '50',
                y: '50',
              }}
            />
            <div>{card.name}</div>
          </PlayerCardStyledLi>
        ))}
      </PlayerCardsStyledUL>
    </StyledWrapper>
  )
}
type StyledWrapperProps = {
  playerID: string
}
const StyledWrapper = styled.div<StyledWrapperProps>`
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.playerColors[props.playerID]};
  button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.2) inset;
  }
  h2 {
    font-size: 1.4rem;
    padding: 0.3rem 0 0 0.3rem;
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
type PlayerCardStyledLiProps = {
  bg: string
  isCurrentSelectedCard: boolean
}
const PlayerCardStyledLi = styled.li<PlayerCardStyledLiProps>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
  color: var(--player-color);
  border: 0.1px solid var(--player-color);
  color: var(--player-color);
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
