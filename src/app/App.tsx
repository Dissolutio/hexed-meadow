import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { DevApp } from './DevApp'
import { StagingApp } from './StagingApp'
import { ProductionApp } from './ProductionApp'

const appModes = {
  dev: 'dev',
  staging: 'staging',
  production: 'production',
}
let myMode = appModes.dev
//! TOGGLE THIS TO OVERRIDE NODE_ENV AND SET SERVER USAGE
myMode = appModes.staging
//
if (process.env.NODE_ENV === 'production') {
  myMode = appModes.production
}
//!

const isDevNoServer = myMode === appModes.dev
const isDevWithServer = myMode === appModes.staging
const isProduction = myMode === appModes.production

export const App = () => {
  return (
    <BrowserRouter>
      {isDevNoServer ? (
        <DevApp />
      ) : isDevWithServer ? (
        <StagingApp />
      ) : isProduction ? (
        <ProductionApp />
      ) : (
        <div>No mode specified</div>
      )}
    </BrowserRouter>
  )
}
