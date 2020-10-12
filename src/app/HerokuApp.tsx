import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { Client, Lobby } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'

import Board from '../ui/Board'
import { HexedMeadow } from '../game/game'
import { HelpPage, FeedbackPage } from '../ui/pages'

export const HerokuApp = () => {
  return (
    <Switch>
      <Route exact path="/">
        <HerokuDeployedLobby />
      </Route>
      <Route exact path="/example">
        <Link to="/team0">Bees!</Link>
        <Link to="/team1">Butterflies!</Link>
      </Route>
      <Route exact path="/team0">
        <DeployClient matchID="example" playerID={'0'} />
      </Route>
      <Route exact path="/team1">
        <DeployClient matchID="example" playerID={'1'} />
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

const DeployClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: SocketIO({
    server: `https://${window.location.hostname}`,
  }),
  debug: false,
  // loading: LoadingComponent,
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})

const HerokuDeployedLobby = () => {
  return (
    <Lobby
      gameServer={`https://${window.location.hostname}`}
      lobbyServer={`https://${window.location.hostname}`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
    />
  )
}
