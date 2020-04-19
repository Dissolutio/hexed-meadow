import React, { useState } from 'react'
import { Client, Lobby } from 'boardgame.io/react'
import { Local } from 'boardgame.io/multiplayer'
import { SocketIO } from 'boardgame.io/multiplayer'

import { HexedMeadow } from './game/game'
import Board from './ui/Board'

import 'normalize.css'
import './theme.css'

export const App = () => {
  return (
    <>
      {/* <HexedMeadowClient gameID="gameid" playerID={'0'} />
      <HexedMeadowClient gameID="gameid" playerID={'1'} /> */}
      <MainLobby />
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
    server: 'https://hexed-meadow-server.herokuapp.com',
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
      gameServer={`https://hexed-meadow-server.herokuapp.com`}
      lobbyServer={`https://hexed-meadow-server.herokuapp.com`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
      // debug={true}
    />
  )
}
