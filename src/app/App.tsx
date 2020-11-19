import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Client, Lobby as BgioLobby } from 'boardgame.io/react'
import { Local, SocketIO } from 'boardgame.io/multiplayer'

import { HexedMeadow } from 'game/game'
import { Board } from './Board'
import { PageRoutes } from './PageRoutes'

const isDev = process.env.NODE_ENV === 'development'
const withSeperateServer = Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER)
const isProduction = process.env.NODE_ENV === 'production'

export const App = () => {
  const { protocol, hostname, port } = window.location
  const serverAddress = isProduction
    ? `${protocol}//${hostname}:${port}`
    : `http://localhost:8000`
  const importedGames = [{ game: HexedMeadow, board: Board }]
  return (
    <BrowserRouter>
      {/* DEV - local multiplayer, no server, no lobby */}
      {isDev && !withSeperateServer && <DevApp />}
      {/* SEPARATE - lobby & client that connect to the node server in ~/devserver.js */}
      {isDev && withSeperateServer && (
        <Lobby serverAddress={serverAddress} importedGames={importedGames} />
      )}
      {/* PROD - lobby & client for build and deployment as static asset for node server in ~/server.js */}
      {isProduction && (
        <Lobby serverAddress={serverAddress} importedGames={importedGames} />
      )}
    </BrowserRouter>
  )
}

const DevApp = () => {
  return (
    <Switch>
      <Route exact path="/">
        <GameClient matchID="matchID" playerID={'0'} />
        <GameClient matchID="matchID" playerID={'1'} />
      </Route>
      <PageRoutes />
    </Switch>
  )
}

const Lobby = ({ serverAddress, importedGames }) => {
  return (
    <Switch>
      <Route exact path="/">
        <div>
          <h1>Hexed Meadow</h1>
          <BgioLobby
            gameServer={serverAddress}
            lobbyServer={serverAddress}
            gameComponents={importedGames}
          />
        </div>
      </Route>
      <PageRoutes />
    </Switch>
  )
}

const clientOpts = {
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: isProduction
    ? SocketIO({ server: `https://${window.location.hostname}` })
    : withSeperateServer
    ? SocketIO({ server: 'http://localhost:8000' })
    : Local(),
  debug: false,
  enhancer: isDev
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : null,
}
const GameClient = Client({
  ...clientOpts,
})
