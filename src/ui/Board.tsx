import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BoardProps } from 'boardgame.io/react'
import {
  BoardContextProvider,
  UIContextProvider,
  LayoutContextProvider,
  PlacementContextProvider,
  TurnContextProvider,
} from 'ui/hooks'
import { Layout } from './layout/Layout'
import { TopConsole } from './layout/TopConsole'
import { BottomConsole } from './layout/BottomConsole'
import { MapDisplay } from './hexmap/MapDisplay'
import { theme } from 'ui/theme/theme'

export const Board = (props: BoardProps) => {
  const { playerID } = props

  // Layout applies CSS to Children, the children are switches based on active string in LayoutContext
  return (
    <ThemeProvider theme={theme}>
      <BoardContextProvider {...props}>
        <UIContextProvider playerID={playerID}>
          <LayoutContextProvider>
            <PlacementContextProvider>
              <TurnContextProvider>
                <Layout>
                  <TopConsole />
                  <MapDisplay />
                  <BottomConsole />
                </Layout>
              </TurnContextProvider>
            </PlacementContextProvider>
          </LayoutContextProvider>
        </UIContextProvider>
      </BoardContextProvider>
    </ThemeProvider>
  )
}

export default Board