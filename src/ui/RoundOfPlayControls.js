import React from 'react'
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from 'react-icons/hi'

import styled from 'styled-components'
import Button from 'react-bootstrap/esm/Button'

import { useBoardContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from './UnitIcon'
import { hexagonsHeroPatternDataUrl } from 'ui/layout/hexagonsHeroPatternDataUrl'
import { playerColorUrlEncoded } from './theme/theme'

export const RoundOfPlayControls = () => {
  const { isMyTurn, isAttackingStage } = useBoardContext()
  console.log(`RoundOfPlayControls -> isAttackingStage`, isAttackingStage)
  if (!isMyTurn) {
    return <TheirMoveUI />
  }
  if (isMyTurn && !isAttackingStage) {
    return <MyMoveUI />
  }
  if (isMyTurn && isAttackingStage) {
    return <MyAttackUI />
  }
}

const TheirMoveUI = () => {
  const { currentOrderMarker, playerID } = useBoardContext()
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

const MyMoveUI = () => {
  const {
    myCards,
    currentOrderMarker,
    currentTurnGameCardID,
    playerID,
    undo,
    redo,
    endCurrentPlayerTurn,
    endCurrentMoveStage,
  } = useBoardContext()
  const {
    selectedGameCardID,
    onSelectCard__turn,
    revealedGameCard,
  } = useTurnContext()

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
    const activeTurnCards = clone.find((card) => isCurrentTurnCard(card))
    const nonActiveTurnCards = clone.filter((card) => !isCurrentTurnCard(card))
    return [activeTurnCards, ...nonActiveTurnCards]
  }

  const isCurrentSelectedCard = (card) => {
    return card?.gameCardID === selectedGameCardID
  }
  return (
    <StyledWrapper playerID={playerID}>
      <h2>{`Your #${currentOrderMarker + 1}: ${revealedGameCard.name}`}</h2>
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
    </StyledWrapper>
  )
}
const MyAttackUI = () => {
  const {
    playerID,
    myCards,
    currentOrderMarker,
    currentTurnGameCardID,
    endCurrentPlayerTurn,
  } = useBoardContext()
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
    const activeTurnCards = clone.find((card) => isCurrentTurnCard(card))
    const nonActiveTurnCards = clone.filter((card) => !isCurrentTurnCard(card))
    return [activeTurnCards, ...nonActiveTurnCards]
  }
  return (
    <StyledWrapper playerID={playerID}>
      <h2>{`Your #${currentOrderMarker + 1}: ${revealedGameCard.name}`}</h2>
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
    </StyledWrapper>
  )
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
