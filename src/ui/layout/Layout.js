import React from 'react'
import styled from 'styled-components'
import { useUIContext } from '../hooks/useUIContext'
import { SlideMenu } from './SlideMenu'

export const Layout = ({ children }) => {
  const { playerID } = useUIContext()

  const pClass = `board-${playerID}`
  return (
    <>
      <LayoutContainer pID={playerID}>
        <LayoutTop>{children[0]}</LayoutTop>
        <SlideMenu playerID={[playerID]} />
        <LayoutMiddle className={`${pClass}`}>{children[1]}</LayoutMiddle>
        <LayoutBottom>{children[2]}</LayoutBottom>
      </LayoutContainer>
    </>
  )
}

const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 99vh;
  padding: 0;
  margin: 0;
  --mainColor: ${(props) =>
    props.pID === '0' ? `var(--bee-yellow)` : `var(--butterfly-purple)`};
  color: --mainColor;
`
const LayoutTop = styled.div`
  width: 100%;
  height: 8vh;
`
const LayoutBottom = styled.div`
  width: 100%;
  min-height: 27vh;
`
const LayoutMiddle = styled.div`
  width: 100%;
  height: 65vh;
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
    --mainColor: var(--bee-yellow);
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
    --mainColor: var(--butterfly-purple);
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
