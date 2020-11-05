import React from 'react'
import styled from 'styled-components'
import { useBoardContext, usePlacementContext } from 'ui/hooks'

interface Props {}

export const TurnCounter = (props: Props) => {
  return <div></div>
}

const StyledTurnCounter = styled.span`
  position: absolute;
  top: 0%;
  left: 30%;
  padding-top: 36px;
  padding-left: 36px;
  @media screen and (max-width: 1100px) {
    padding-top: 14px;
    padding-left: 14px;
  }
  z-index: 2;
  button {
    background-color: var(--gunmetal-transparent);
  }
  svg {
    width: 30px;
    height: 30px;
    @media screen and (max-width: 1100px) {
      width: 18px;
      height: 18px;
    }
  }
`
