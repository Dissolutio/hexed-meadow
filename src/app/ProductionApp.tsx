import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { Client, Lobby } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'

import Board from './Board'
import { HexedMeadow } from 'game/game'
import { HelpPage, FeedbackPage } from 'ui/pages'

export const ProductionApp = () => {
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
        <ProductionClient matchID="example" playerID={'0'} />
      </Route>
      <Route exact path="/team1">
        <ProductionClient matchID="example" playerID={'1'} />
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

const ProductionClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: SocketIO({
    server: `https://${window.location.hostname}`,
  }),
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})

const ProductionLobby = () => {
  const { protocol, hostname, port } = window.location
  const server = `${protocol}//${hostname}:${port}`
  const importedGames = [{ game: HexedMeadow, board: Board }]
  return (
    <div>
      <h1>Lobby</h1>
      <Lobby
        gameServer={server}
        lobbyServer={server}
        gameComponents={importedGames}
      />
    </div>
  )
}
