import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BoardProps } from 'boardgame.io/react'

import {
  BoardContextProvider,
  PlacementContextProvider,
  TurnContextProvider,
} from './hooks'
import { Layout } from './layout/Layout'
import { AppNavbar } from './layout/AppNavbar'
import { BottomConsole } from './layout/BottomConsole'
import { MapDisplay } from './hexmap/MapDisplay'
import { theme } from './theme/theme'

export const Board = (props: BoardProps) => {
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
