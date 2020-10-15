import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Client } from 'boardgame.io/react'
import { Local } from 'boardgame.io/multiplayer'

import Board from '../ui/Board'
import { HexedMeadow } from '../game/game'
import { HelpPage, FeedbackPage } from '../ui/pages'

export const DevApp = () => {
  return (
    <Switch>
      <Route exact path="/">
        <DevClient matchID="matchID" playerID={'0'} />
        <DevClient matchID="matchID" playerID={'1'} />
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
const DevClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  board: Board,
  multiplayer: Local(),
  debug: false,
  enhancer:
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
})
