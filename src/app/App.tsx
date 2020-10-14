import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { DevApp } from './DevApp'
import { LocalServerApp } from './LocalServerApp'
import { HerokuApp } from './HerokuApp'

const appModes = {
  dev: 'dev',
  devWithLocalServer: 'devWithLocalServer',
  herokuDeployment: 'herokuDeployment',
}
let myMode = appModes.dev
//! TOGGLE THIS TO OVERRIDE NODE_ENV AND SET SERVER USAGE
// myMode = appModes.devWithLocalServer
//
if (process.env.NODE_ENV === 'production') {
  myMode = appModes.herokuDeployment
}
//!

const isDevNoServer = myMode === appModes.dev
const isDevWithServer = myMode === appModes.devWithLocalServer
const isProduction = myMode === appModes.herokuDeployment

export const App = () => {
  return (
    <BrowserRouter>
      {isDevNoServer ? (
        <DevApp />
      ) : isDevWithServer ? (
        <LocalServerApp />
      ) : isProduction ? (
        <HerokuApp />
      ) : (
        <div>No mode specified</div>
      )}
    </BrowserRouter>
  )
}
