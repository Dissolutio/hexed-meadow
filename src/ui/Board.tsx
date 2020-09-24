import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BoardProps } from 'boardgame.io/react'

import {
  BoardContextProvider,
  LayoutContextProvider,
  PlacementContextProvider,
  TurnContextProvider,
} from 'ui/hooks'
import { Layout } from './layout/Layout'
import { AppNavbar } from './layout/AppNavbar'
import { BottomConsole } from './layout/BottomConsole'
import { MapDisplay } from './hexmap/MapDisplay'
import { theme } from 'ui/theme/theme'

export const Board = (props: BoardProps) => {
  // Layout applies CSS to Children, the children are switches based on active string in LayoutContext
  return (
    <ThemeProvider theme={theme}>
      <BoardContextProvider {...props}>
        <LayoutContextProvider>
          <PlacementContextProvider>
            <TurnContextProvider>
              <Layout>
                <AppNavbar />
                <MapDisplay />
                <BottomConsole />
              </Layout>
            </TurnContextProvider>
          </PlacementContextProvider>
        </LayoutContextProvider>
      </BoardContextProvider>
    </ThemeProvider>
  )
}

export default Board
