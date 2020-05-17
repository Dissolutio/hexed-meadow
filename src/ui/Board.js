import React, { useState, useEffect } from 'react'

import { BoardContextProvider } from './hooks/useBoardContext'
import { UIContextProvider } from './hooks/useUIContext'
import { LayoutContextProvider } from './hooks/useLayoutContext'

import { Layout } from './layout/Layout'
import { TopConsole } from './layout/TopConsole'
import { BottomConsole } from './layout/BottomConsole'
import { MapDisplay } from './MapDisplay'

export const Board = ({ G, ctx, moves, playerID, ...props }) => {
  const gameContextProps = { G, ctx, moves, playerID }

  // Layout applies CSS to Children, the children are switches based on active string in LayoutContext
  return (
    <UIContextProvider playerID={playerID}>
      <BoardContextProvider {...gameContextProps}>
        <LayoutContextProvider>
          <Layout>
            <TopConsole />
            <MapDisplay />
            <BottomConsole />>
          </Layout>
        </LayoutContextProvider>
      </BoardContextProvider>
    </UIContextProvider>
  )
}

export default Board
