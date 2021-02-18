import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BoardProps } from 'boardgame.io/react'
import {
  PlayerIDProvider,
  GProvider,
  MovesProvider,
  CtxProvider,
  MapContextProvider,
  UIContextProvider,
  PlacementContextProvider,
  PlayContextProvider,
} from 'ui/hooks'
import { Layout, HeaderNav } from 'ui/layout'
import { BottomConsole } from 'ui/controls'
import { MapDisplay } from 'ui/hexmap'
import { theme } from './theme'

export const Board: React.FunctionComponent<BoardProps> = ({
  playerID,
  G,
  ctx,
  moves,
  undo,
  redo,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <PlayerIDProvider playerID={playerID}>
        <GProvider G={G}>
          <CtxProvider ctx={ctx}>
            <MovesProvider moves={moves} undo={undo} redo={redo}>
              <MapContextProvider>
                <UIContextProvider>
                  <PlacementContextProvider>
                    <PlayContextProvider>
                      <Layout>
                        <HeaderNav />
                        <MapDisplay />
                        <BottomConsole />
                      </Layout>
                    </PlayContextProvider>
                  </PlacementContextProvider>
                </UIContextProvider>
              </MapContextProvider>
            </MovesProvider>
          </CtxProvider>
        </GProvider>
      </PlayerIDProvider>
    </ThemeProvider>
  )
}

export default Board
