import React from 'react'
import { Client, Lobby } from 'boardgame.io/react'
import { Local } from 'boardgame.io/multiplayer'
import { SocketIO } from 'boardgame.io/multiplayer'

import { HexedMeadow } from './game/game'
import { BoardContextProvider } from './ui/hooks/useBoardContext'
import { UIContextProvider } from './ui/hooks/useUIContext'
import Board from './ui/Board'

import 'normalize.css'
import './theme.css'

export const App = () => {
  return (
    <>
      {/* <MainLobby /> */}
      <UIContextProvider>
        <BoardContextProvider>
          <HexedMeadowClient gameID="gameid" playerID={'0'} />
        </BoardContextProvider>
      </UIContextProvider>
      <hr />
      <UIContextProvider>
        <BoardContextProvider>
          <HexedMeadowClient gameID="gameid" playerID={'1'} />
        </BoardContextProvider>
      </UIContextProvider>
    </>
  )
}
// return <MainLobby />

const HexedMeadowClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  // loading: LoadingComponent,
  board: Board,
  multiplayer: Local(),
  // multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  // multiplayer: SocketIO({
  //   server: `https://${window.location.hostname}`,
  // }),
  debug: false,
  enhancer:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
})

const MainLobby = () => {
  return (
    <Lobby
      gameServer={`http://localhost:8000`}
      lobbyServer={`http://localhost:8000`}
      // gameServer={`https://${window.location.hostname}`}
      // lobbyServer={`https://${window.location.hostname}`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
      // debug={true}
    />
  )
}

const LoadingComponent = (props) => {
  return <div>Connecting...</div>
}
