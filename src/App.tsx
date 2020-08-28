import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Client, Lobby } from 'boardgame.io/react'
import { Local } from 'boardgame.io/multiplayer'
import { SocketIO } from 'boardgame.io/multiplayer'

import Board from './ui/Board'

import { HexedMeadow } from './game/game'
import 'normalize.css'
import './theme.css'

const devModes = {
  dev: 'dev',
  devWithLocalServer: 'devWithLocalServer',
  herokuDeployment: 'herokuDeployment',
}

// TOGGLE THIS TO OVERRIDE NODE_ENV AND SET SERVER USAGE
let devMode = devModes.dev
// let devMode = devModes.devWithLocalServer
if (process.env.NODE_ENV === 'production') {
  devMode = devModes.herokuDeployment
}

export const App = () => {
  return (
    <BrowserRouter>
      <EnvApp />
    </BrowserRouter>
  )
}

const EnvApp = () => {
  if (devMode === devModes.dev) {
    return <DevApp />
  }
  if (devMode === devModes.devWithLocalServer) {
    return <DevAppWithLocalServer />
  }
  if (devMode === devModes.herokuDeployment) {
    return <HerokuApp />
  }
}

export const DevApp = () => {
  return (
    <>
      <DevClient gameID="gameid" playerID={'0'} />
      <DevClient gameID="gameid" playerID={'1'} />
    </>
  )
}

export const DevAppWithLocalServer = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Link to="/team0">Bees!</Link>
        <Link to="/team1">Butterflies!</Link>
      </Route>
      <Route exact path="/team0">
        <DevLocalServerClient gameID="gameid" playerID={'0'} />
      </Route>
      <Route exact path="/team1">
        <DevLocalServerClient gameID="gameid" playerID={'1'} />
      </Route>
    </Switch>
  )
}

const LoadingComponent = (props) => {
  return <div>Connecting...</div>
}

const DevClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: Local(),
  debug: false,
  loading: LoadingComponent,
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})

const DevLocalServerClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  debug: true,
  loading: LoadingComponent,
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})

const DeployClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: SocketIO({
    server: `https://${window.location.hostname}`,
  }),
  debug: false,
  loading: LoadingComponent,
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})

const HerokuApp = (props) => {
  return (
    <Switch>
      <Route exact path="/">
        <Link to="/team0">Bees!</Link>
        <Link to="/team1">Butterflies!</Link>
      </Route>
      <Route exact path="/team0">
        <DeployClient gameID="gameid" playerID={'0'} />
      </Route>
      <Route exact path="/team1">
        <DeployClient gameID="gameid" playerID={'1'} />
      </Route>
    </Switch>
  )
}
const DevLocalServerLobby = () => {
  return (
    <Lobby
      gameServer={`http://localhost:8000`}
      lobbyServer={`http://localhost:8000`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
      debug={false}
    />
  )
}
const HerokuDeployedLobby = (params) => {
  return (
    <Lobby
      gameServer={`https://${window.location.hostname}`}
      lobbyServer={`https://${window.location.hostname}`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
    />
  )
}
