import React from 'react'
import styled from 'styled-components'

import { GameArmyCard } from 'game/types'
import { useG, usePlayerID, useUIContext, usePlayContext } from 'ui/hooks'
import { UnitIcon } from 'ui/icons'
import { hexagonsHeroPatternDataUrl } from 'assets/hexagonsHeroPatternDataUrl'

export const RopArmyCardsList = () => {
  const { playerID } = usePlayerID()
  const { myCards } = useG()
  const { selectedGameCardID } = useUIContext()

  const { currentTurnGameCardID, onSelectCard__turn } = usePlayContext()
  const hexagonBgDataUrl = hexagonsHeroPatternDataUrl(playerID)

  const handleArmyCardClick = (gameCardID: string) => {
    onSelectCard__turn(gameCardID)
  }
  const isCurrentSelectedCard = (card: GameArmyCard) => {
    return card?.gameCardID === selectedGameCardID
  }
  const myTurnCards = () => {
    const isCurrentTurnCard = (card: GameArmyCard) => {
      return card?.gameCardID === currentTurnGameCardID
    }
    //🛠 sort active card to top
    const myActiveCard = myCards.find((card: GameArmyCard) =>
      isCurrentTurnCard(card)
    )
    const myInactiveCards = myCards.filter(
      (card: GameArmyCard) => !isCurrentTurnCard(card)
    )
    return [myActiveCard, ...myInactiveCards]
  }
  return (
    <PlayerCardsStyledUL>
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
  )
}
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
