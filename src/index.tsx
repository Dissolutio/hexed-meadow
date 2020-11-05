import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { DevApp, DevAppSeparate, ProductionApp } from './app'
import * as serviceWorker from './serviceWorker'
import 'normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './theme.css'

const isDev = process.env.NODE_ENV === 'development'
const withSeperateServer = Boolean(process.env.REACT_APP_WITH_SEPERATE_SERVER)
const isProduction = process.env.NODE_ENV === 'production'

const App = () => {
  return (
    <BrowserRouter>
      {isDev && !withSeperateServer && <DevApp />}
      {isDev && withSeperateServer && <DevAppSeparate />}
      {isProduction && <ProductionApp />}
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
