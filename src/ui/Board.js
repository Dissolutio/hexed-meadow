import React from 'react'

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

export const Board = (props) => {
  const { G, ctx, moves, playerID } = props
  const gameContextProps = { G, ctx, moves, playerID }

  // Layout applies CSS to Children, the children are switches based on active string in LayoutContext
  return (
    <BoardContextProvider {...gameContextProps}>
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
  )
}

export default Board
