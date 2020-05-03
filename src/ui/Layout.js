import React from 'react'
import styled from 'styled-components'
import { useBoardContext } from './useBoardContext'

export const Layout = ({ children }) => {
  const { playerID } = useBoardContext()

  const pClass = `board-${playerID}`
  return (
    <LayoutContainer>
      <LayoutTop>{children[0]}</LayoutTop>
      <LayoutMiddle className={`${pClass}`}>{children[1]}</LayoutMiddle>
      <LayoutBottom>{children[2]}</LayoutBottom>
    </LayoutContainer>
  )
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 99vh;
  padding: 0;
  margin: 0;
`
const LayoutTop = styled.div`
  height: 10%;
  width: 100%;
`
const LayoutMiddle = styled.div`
  width: 100vw;
  height: 75%;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0.5rem;
    background: var(--black);
  }
  &::-webkit-scrollbar-track-piece {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-corner {
    background: var(--black);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }
  &.board-0 {
    background: radial-gradient(ellipse at top, var(--bee-yellow), transparent),
      radial-gradient(ellipse at bottom, var(--black), transparent);
    ::-webkit-scrollbar-track-piece {
      box-shadow: inset 0 0 5px var(--bee-yellow);
      width: 0.5rem;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--bee-yellow);
    }
  }
  &.board-1 {
    background: radial-gradient(
        ellipse at top,
        var(--butterfly-purple),
        transparent
      ),
      radial-gradient(ellipse at bottom, var(--black), transparent);
    ::-webkit-scrollbar-track-piece {
      box-shadow: inset 0 0 5px var(--butterfly-purple);
      /* background-color: var(black); */
      width: 0.5rem;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--butterfly-purple);
    }
  }
`
const LayoutBottom = styled.div`
  height: 15%;
  width: 100%;
  section.data-readout {
    display: flex;
    flex-flow: column wrap;
    height: 100%;
    color: var(--black);
    font-size: 0.8rem;
  }
`
