import React, { useState } from 'react'
import styled from 'styled-components';
import { Client, Lobby } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { SocketIO } from "boardgame.io/multiplayer";

import Board from './ui/Board'
import { HexedMeadow } from './game/game'

export const App = () => {
  // return (
  //   <MainLobby />
  // )

  return (
    <>
      <HexedMeadowClient gameID="gameid" playerID='0' />
      <HexedMeadowClient gameID="gameid" playerID='1' />
    </>
  );
}

const HexedMeadowClient = Client({
  game: HexedMeadow,
  board: Board,
  // multiplayer: Local(),
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  // multiplayer: SocketIO({ server: 'http://battlescape-server.herokuapp.com' }),
  numPlayers: 2,
  debug: false,
  enhancer: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});

// const MainLobby = () => {
//   return (
//     <Lobby
//       gameServer={`http://localhost:8000`}
//       lobbyServer={`http://localhost:8000`}
//       // gameServer={`http://battlescape-server.herokuapp.com`}
//       // lobbyServer={`http://battlescape-server.herokuapp.com`}
//       gameComponents={[{ game: Battlescape, board: Board }]}
//     />
//   )
// }