import React, { useState, useEffect } from 'react'

import { BoardContextProvider } from './hooks/useBoardContext'
import { UIContextProvider } from './hooks/useUIContext'
import { LayoutContextProvider } from './hooks/useLayoutContext'
import { PlacementContextProvider } from './hooks/usePlacementContext'

import { Layout } from './layout/Layout'
import { TopConsole } from './layout/TopConsole'
import { BottomConsole } from './layout/BottomConsole'
import { MapDisplay } from './MapDisplay'

export const Board = (props) => {
  const { G, ctx, moves, playerID } = props
  const gameContextProps = { G, ctx, moves, playerID }

  // Layout applies CSS to Children, the children are switches based on active string in LayoutContext
  return (
    <BoardContextProvider {...gameContextProps}>
      <UIContextProvider playerID={playerID}>
        <LayoutContextProvider>
          <PlacementContextProvider>
            <Layout>
              <TopConsole />
              <MapDisplay />
              <BottomConsole />>
            </Layout>
          </PlacementContextProvider>
        </LayoutContextProvider>
      </UIContextProvider>
    </BoardContextProvider>
  )
}

export default Board
