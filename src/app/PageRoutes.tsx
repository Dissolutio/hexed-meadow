import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { FeedbackPage, HelpPage, RulesPage } from 'ui/pages'

export const PageRoutes = () => {
  return (
    <Switch>
      <Route exact path="/help">
        <HelpPage />
      </Route>
      <Route exact path="/feedback">
        <FeedbackPage />
      </Route>
      <Route exact path="/rules">
        <RulesPage />
      </Route>
    </Switch>
  )
}
