import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { Client, Lobby } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'

import Board from '../ui/Board'
import { HexedMeadow } from '../game/game'
import { HelpPage } from '../ui/pages'
import { FeedbackPage } from '../ui/pages/FeedbackPage'

export const LocalServerApp = () => {
  return (
    <Switch>
      <Route exact path="/">
        <DevLocalServerLobby />
      </Route>
      <Route exact path="/example">
        <Link to="/team0">Bees!</Link>
        <Link to="/team1">Butterflies!</Link>
      </Route>
      <Route exact path="/team0">
        <DevLocalServerClient matchID="example" playerID={'0'} />
      </Route>
      <Route exact path="/team1">
        <DevLocalServerClient matchID="example" playerID={'1'} />
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

const DevLocalServerClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  debug: false,
  // loading: LoadingComponent,
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})

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
