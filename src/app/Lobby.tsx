import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Lobby as BgioLobby } from 'boardgame.io/react'

import { PageRoutes } from './PageRoutes'

export const Lobby = ({ serverAddress, importedGames }) => {
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
