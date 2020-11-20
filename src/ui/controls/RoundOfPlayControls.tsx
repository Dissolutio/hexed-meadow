import React from 'react'
import styled from 'styled-components'
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from 'react-icons/hi'
import Button from 'react-bootstrap/esm/Button'

import { useBoardContext, useTurnContext } from 'ui/hooks'
import { RopArmyCardsList } from './RopArmyCardsList'

export const RopIdleControls = () => {
  const { G } = useBoardContext()
  const { currentOrderMarker } = G
  const { revealedGameCard } = useTurnContext()
  return (
    <>
      <h2>
        {`Opponent's #${currentOrderMarker + 1} is ${
          revealedGameCard?.name ?? '...'
        }`}
      </h2>
    </>
  )
}

export const RopMoveControls = () => {
  const { G, moves, undo, redo } = useBoardContext()
  const { unitsMoved, currentOrderMarker } = G
  const { endCurrentMoveStage } = moves
  const { revealedGameCard } = useTurnContext()

  //🛠 handlers
  const handleEndMovementClick = () => {
    endCurrentMoveStage()
  }
  return (
    <>
      <h2>{`Your #${currentOrderMarker + 1}: ${
        revealedGameCard?.name ?? ''
      }`}</h2>
      <p>
        You have moved {unitsMoved.length} / {revealedGameCard?.figures ?? 0}{' '}
        units{' '}
      </p>
      <ButtonWrapper>
        <Button variant="danger" onClick={handleEndMovementClick}>
          END MOVE
        </Button>
        <span>
          <Button variant="secondary" onClick={undo}>
            <HiOutlineArrowCircleLeft />
            <span>UNDO</span>
          </Button>
          <Button variant="secondary" onClick={redo}>
            <HiOutlineArrowCircleRight />
            REDO
          </Button>
        </span>
      </ButtonWrapper>
      <RopArmyCardsList />
    </>
  )
}

export const RopAttackControls = () => {
  const {
    G,
    moves,
    // computed
  } = useBoardContext()
  const { endCurrentPlayerTurn } = moves
  const { unitsAttacked, currentOrderMarker } = G

  const { revealedGameCard } = useTurnContext()

  const handleEndTurnButtonClick = () => {
    endCurrentPlayerTurn()
  }
  return (
    <>
      <h2>{`Your #${currentOrderMarker + 1}: ${
        revealedGameCard?.name ?? ''
      }`}</h2>
      <p>
        You have used {unitsAttacked.length} / {revealedGameCard?.figures ?? 0}{' '}
        attacks{' '}
      </p>
      <ButtonWrapper>
        <Button variant="danger" onClick={handleEndTurnButtonClick}>
          END TURN
        </Button>
      </ButtonWrapper>
      <RopArmyCardsList />
    </>
  )
}

const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 26px;
`
