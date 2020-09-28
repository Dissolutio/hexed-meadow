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
  // Layout applies CSS to Children, the children are switches based on active string in LayoutContext
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
