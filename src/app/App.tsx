import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Client, Lobby } from 'boardgame.io/react'
import { Local, SocketIO } from 'boardgame.io/multiplayer'

import { HexedMeadow } from 'game/game'
import { Board } from './Board'
import { FeedbackPage, HelpPage } from 'ui/pages'

const isDev = process.env.NODE_ENV === 'development'
const withSeperateServer = Boolean(process.env.REACT_APP_WITH_SEPERATE_SERVER)
const isProduction = process.env.NODE_ENV === 'production'

export const App = () => {
  return (
    <BrowserRouter>
      {isDev && !withSeperateServer && <DevApp />}
      {isDev && withSeperateServer && <DevAppSeparate />}
      {isProduction && <ProductionApp />}
    </BrowserRouter>
  )
}

const clientOpts = () => ({
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
})

// DEV - local multiplayer, no server, no lobby
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
const GameClient = Client({
  ...clientOpts(),
})
// SEPARATE - lobby & client that connect to the node server in ~/devserver.js
const DevAppSeparate = () => {
  return (
    <Switch>
      <Route exact path="/">
        <DevSeparateLobby />
      </Route>
      <Route exact path="/example">
        <Link to="/team0">Bees!</Link>
        <Link to="/team1">Butterflies!</Link>
      </Route>
      <Route exact path="/team0">
        <GameClient matchID="example" playerID={'0'} />
      </Route>
      <Route exact path="/team1">
        <GameClient matchID="example" playerID={'1'} />
      </Route>
      <Route path="/help">
        <HelpPage />
      </Route>
      <Route path="/feedback">
        <FeedbackPage />
      </Route>
    </Switch>
  )
}
const DevSeparateLobby = () => {
  const importedGames = [{ game: HexedMeadow, board: Board }]
  return (
    <div>
      <h1>Lobby</h1>
      <Lobby
        gameServer={`http://localhost:8000`}
        lobbyServer={`http://localhost:8000`}
        gameComponents={importedGames}
      />
    </div>
  )
}
// PROD - lobby & client for build and deployment as static asset for node server in ~/server.js
const ProductionApp = () => {
  return (
    <Switch>
      <Route exact path="/">
        <ProductionLobby />
      </Route>
      <Route exact path="/example">
        <Link to="/team0">Bees!</Link>
        <Link to="/team1">Butterflies!</Link>
      </Route>
      <Route exact path="/team0">
        <GameClient />
      </Route>
      <Route exact path="/team1">
        <GameClient />
      </Route>
      <Route exact path="/help">
        <HelpPage />
      </Route>
      <Route exact path="/feedback">
        <FeedbackPage />
      </Route>
    </Switch>
  )
}
const PageRoutes = () => {
  return (
    <Switch>
      <Route exact path="/help">
        <HelpPage />
      </Route>
      <Route exact path="/feedback">
        <FeedbackPage />
      </Route>
    </Switch>
  )
}
const ProductionLobby = () => {
  const { protocol, hostname, port } = window.location
  const server = `${protocol}//${hostname}:${port}`
  const importedGames = [{ game: HexedMeadow, board: Board }]
  return (
    <div>
      <h1>Hexed Meadow</h1>
      <Lobby
        gameServer={server}
        lobbyServer={server}
        gameComponents={importedGames}
      />
    </div>
  )
}
