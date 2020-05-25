import React, { useContext, useState, useEffect } from 'react'
import { useBoardContext } from './useBoardContext'

const LayoutContext = React.createContext({})

const LayoutContextProvider = ({ children }) => {
  const layoutComponents = {
    // TOP CONSOLE
    navbar: 'NavBar',
    // BOTTOM CONSOLE
    placementArmy: 'PlacementControls',
    placeOrderMarkers: 'PlaceOrderMarkers',
    dataReadout: 'DataReadout',
    rollingInitiative: 'RollingInitiative',
    myTurnUI: 'MyTurnUI',
  }
  const { currentPhase } = useBoardContext()
  const [topConsoleComponent, setTopConsoleComponent] = useState(
    layoutComponents.navbar
  )
  const [bottomConsoleComponent, setBottomConsoleComponent] = useState(
    initialBottomConsole()
  )

  function initialBottomConsole() {
    if (currentPhase === 'placement') {
      return layoutComponents.placementArmy
    }
    if (currentPhase === 'placeOrderMarkers') {
      return layoutComponents.placeOrderMarkers
    }
    if (currentPhase === 'rollingInitiative') {
      return layoutComponents.rollingInitiative
    }
    return layoutComponents.myTurnUI
  }
  return (
    <LayoutContext.Provider
      value={{
        layoutComponents,
        topConsoleComponent,
        setTopConsoleComponent,
        bottomConsoleComponent,
        setBottomConsoleComponent,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

const useLayoutContext = () => {
  const {
    layoutComponents,
    topConsoleComponent,
    bottomConsoleComponent,
    setTopConsoleComponent,
    setBottomConsoleComponent,
  } = useContext(LayoutContext)

  const activateDataReadout = () =>
    setBottomConsoleComponent(layoutComponents.dataReadout)

  const activatePlacementControls = () =>
    setBottomConsoleComponent(layoutComponents.placementArmy)

  const activatePlaceOrderMarkers = () =>
    setBottomConsoleComponent(layoutComponents.placeOrderMarkers)

  const activateRollingInitiative = () =>
    setBottomConsoleComponent(layoutComponents.rollingInitiative)

  const activateMyTurnUI = () =>
    setBottomConsoleComponent(layoutComponents.myTurnUI)

  return {
    layoutComponents,
    topConsoleComponent,
    bottomConsoleComponent,
    setTopConsoleComponent,
    setBottomConsoleComponent,
    activatePlacementControls,
    activateDataReadout,
    activatePlaceOrderMarkers,
    activateRollingInitiative,
    activateMyTurnUI,
  }
}

export { LayoutContextProvider, useLayoutContext }
