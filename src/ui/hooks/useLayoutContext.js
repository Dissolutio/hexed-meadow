import React, { useContext, useState } from 'react'
import { useBoardContext } from './useBoardContext'

const LayoutContext = React.createContext({})

const LayoutContextProvider = ({ children }) => {
  const layoutComponents = {
    navbar: 'NavBar',
    placementArmy: 'PlacementControls',
    placeOrderMarkers: 'PlaceOrderMarkers',
    dataReadout: 'DataReadout',
  }
  const [topConsoleComponent, setTopConsoleComponent] = useState(
    layoutComponents.navbar
  )
  const [bottomConsoleComponent, setBottomConsoleComponent] = useState(
    layoutComponents.placementArmy
  )

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
  const { currentPhase } = useBoardContext()

  // if (currentPhase === 'mainGame') {
  //   activatePlaceOrderMarkers()
  // }

  const activateDataReadout = () =>
    setBottomConsoleComponent(layoutComponents.dataReadout)

  const activatePlacementControls = () =>
    setBottomConsoleComponent(layoutComponents.placementArmy)

  const activatePlaceOrderMarkers = () =>
    setBottomConsoleComponent(layoutComponents.placeOrderMarkers)

  return {
    layoutComponents,
    topConsoleComponent,
    bottomConsoleComponent,
    setTopConsoleComponent,
    setBottomConsoleComponent,
    activatePlacementControls,
    activateDataReadout,
    activatePlaceOrderMarkers,
  }
}

export { LayoutContextProvider, useLayoutContext }
