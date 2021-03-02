import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Client } from 'boardgame.io/react'
import { Local, SocketIO } from 'boardgame.io/multiplayer'

import { HexedMeadow } from 'game/game'
import { Board } from './Board'
import { PageRoutes } from './PageRoutes'
import { Lobby } from './Lobby'

//! LOCAL APP with NO SERVER
// `npm run start`
// local multiplayer, no server, no lobby
const isDev = process.env.NODE_ENV === 'development'

//! APP with LOCAL SERVER
// `npm run devstart` + `npm run devserver`
// lobby & client that connect to the node server in ~/devserver.js
const withSeparateServer = Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER)

//! APP for PRODUCTION SERVER
// `npm run build`
// lobby & client as static asset for node server in ~/server.js
const isProduction = process.env.NODE_ENV === 'production'

export const App = () => {
  const importedGames = [{ game: HexedMeadow, board: Board }]
  const { protocol, hostname, port } = window.location
  const serverAddress = isProduction
    ? `${protocol}//${hostname}:${port}`
    : `http://localhost:8000`
  return (
    <BrowserRouter>
      {isDev && !withSeparateServer && <LocalApp />}
      {isDev && withSeparateServer && (
        <Lobby serverAddress={serverAddress} importedGames={importedGames} />
      )}
      {isProduction && (
        <Lobby serverAddress={serverAddress} importedGames={importedGames} />
      )}
    </BrowserRouter>
  )
}

const LocalApp = () => {
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

const clientOpts = {
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: isProduction
    ? SocketIO({ server: `https://${window.location.hostname}` })
    : withSeparateServer
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
