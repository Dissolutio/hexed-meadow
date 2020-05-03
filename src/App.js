import React from 'react'
import { Client, Lobby } from 'boardgame.io/react'
import { Local } from 'boardgame.io/multiplayer'
import { SocketIO } from 'boardgame.io/multiplayer'

import { HexedMeadow } from './game/game'
import { BoardContextProvider } from './ui/useBoardContext'
import Board from './ui/Board'

import 'normalize.css'
import './theme.css'

export const App = () => {
  return (
    <>
      <BoardContextProvider playerID="0">
        <HexedMeadowClient gameID="gameid" playerID={'0'} />
      </BoardContextProvider>
      <hr />
      <BoardContextProvider playerID="1">
        <HexedMeadowClient gameID="gameid" playerID={'1'} />
      </BoardContextProvider>
      {/* <MainLobby /> */}
    </>
  )
}
// return <MainLobby />
const LoadingComponent = (props) => {
  return <div>Connecting...</div>
}

const HexedMeadowClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  // loading: LoadingComponent,
  board: Board,
  // multiplayer: Local(),
  // multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  multiplayer: SocketIO({
    server: `https://${window.location.hostname}`,
  }),
  debug: false,
  enhancer:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
})

const MainLobby = () => {
  return (
    <Lobby
      // gameServer={`http://localhost:8000`}
      // lobbyServer={`http://localhost:8000`}
      gameServer={`https://${window.location.hostname}`}
      lobbyServer={`https://${window.location.hostname}`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
      // debug={true}
    />
  )
}
