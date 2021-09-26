import React from 'react'
import styled from 'styled-components'
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from 'react-icons/hi'
import Button from 'react-bootstrap/esm/Button'

import { useMoves, useG, usePlayContext } from 'ui/contexts'
import { RopArmyCardsList } from './RopArmyCardsList'

export const RopIdleControls = () => {
  const { G } = useG()
  const { currentOrderMarker } = G
  const { revealedGameCard } = usePlayContext()
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
  const { G } = useG()
  const { moves, undo, redo } = useMoves()
  const { revealedGameCard } = usePlayContext()

  const { unitsMoved, currentOrderMarker } = G
  const { endCurrentMoveStage } = moves

  // handlers
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
  const { G } = useG()
  const { moves } = useMoves()
  const { endCurrentPlayerTurn } = moves
  const { unitsAttacked, currentOrderMarker } = G

  const { revealedGameCard } = usePlayContext()

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
