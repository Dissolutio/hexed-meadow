import React, { useContext, useState } from 'react'

const LayoutContext = React.createContext({})

const LayoutContextProvider = ({ children }) => {
  const layoutComponents = {
    navbar: 'NavBar',
    placementArmy: 'PlacementControls',
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

  const activateDataReadout = () =>
    setBottomConsoleComponent(layoutComponents.dataReadout)
  const activatePlacementControls = () =>
    setBottomConsoleComponent(layoutComponents.placementArmy)

  return {
    layoutComponents,
    topConsoleComponent,
    bottomConsoleComponent,
    setTopConsoleComponent,
    setBottomConsoleComponent,
    activatePlacementControls,
    activateDataReadout,
  }
}

export { LayoutContextProvider, useLayoutContext }
