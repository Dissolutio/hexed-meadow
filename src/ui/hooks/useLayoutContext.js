import React, { useContext, useState, useEffect } from 'react'
import { useBoardContext } from './useBoardContext'
import { phaseNames } from '../../game/constants'
const LayoutContext = React.createContext({})

const LayoutContextProvider = ({ children }) => {
  const layoutComponents = {
    // TOP CONSOLE
    navbar: 'NavBar',
    // BOTTOM CONSOLE
    placementArmy: 'PlacementControls',
    placeOrderMarkers: 'PlaceOrderMarkers',
    dataReadout: 'DataReadout',
    roundOfPlayControls: 'RoundOfPlayControls',
  }
  const { currentPhase } = useBoardContext()
  const [topConsoleComponent, setTopConsoleComponent] = useState(
    layoutComponents.navbar
  )
  const [bottomConsoleComponent, setBottomConsoleComponent] = useState(
    setBottomConsole()
  )
  useEffect(() => {
    setBottomConsoleComponent(setBottomConsole())
  }, [currentPhase])
  function setBottomConsole() {
    if (currentPhase === phaseNames.placement) {
      return layoutComponents.placementArmy
    }
    if (currentPhase === phaseNames.placeOrderMarkers) {
      return layoutComponents.placeOrderMarkers
    }
    if (currentPhase === phaseNames.roundOfPlay) {
      return layoutComponents.roundOfPlayControls
    }
    return layoutComponents.roundOfPlayControls
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

  const activateRoundOfPlayControls = () =>
    setBottomConsoleComponent(layoutComponents.roundOfPlayControls)

  return {
    layoutComponents,
    topConsoleComponent,
    bottomConsoleComponent,
    setTopConsoleComponent,
    setBottomConsoleComponent,
    activatePlacementControls,
    activateDataReadout,
    activatePlaceOrderMarkers,
    activateRoundOfPlayControls,
  }
}

export { LayoutContextProvider, useLayoutContext }
