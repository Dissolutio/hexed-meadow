import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BoardProps } from 'boardgame.io/react'

import {
  BoardContextProvider,
  PlacementContextProvider,
  TurnContextProvider,
} from 'ui/hooks'
import { Layout, AppNavbar, BottomConsole } from 'ui/layout'
import { MapDisplay } from 'ui/hexmap'
import { theme } from './theme'

export const Board: React.FunctionComponent<BoardProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <BoardContextProvider {...props}>
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
