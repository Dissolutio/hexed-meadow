import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BoardProps } from 'boardgame.io/react'

import {
  BoardContextProps,
  BoardContextProvider,
  PlacementContextProvider,
  TurnContextProvider,
} from 'ui/hooks'
import { Layout, AppNavbar, BottomConsole } from 'ui/layout'
import { MapDisplay } from 'ui/hexmap'
import { theme } from './theme'

export const Board: React.FunctionComponent<BoardProps> = (props) => {
  const boardContextProps: BoardContextProps = {
    G: props.G,
    ctx: props.ctx,
    moves: props.moves,
    playerID: props.playerID,
    undo: props.undo,
    redo: props.redo,
  }
  return (
    <ThemeProvider theme={theme}>
      <BoardContextProvider {...boardContextProps}>
        <PlacementContextProvider>
          <TurnContextProvider>
            <Layout>
              <AppNavbar />
              <MapDisplay />
              <BottomConsole />
            </Layout>
          </TurnContextProvider>
        </PlacementContextProvider>
      </BoardContextProvider>
    </ThemeProvider>
  )
}

export default Board
