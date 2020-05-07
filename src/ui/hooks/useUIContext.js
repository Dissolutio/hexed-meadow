import React, { useContext, useState } from 'react'

const UIContext = React.createContext([{}, () => {}])

export const UIContextProvider = (props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [playerID, setPlayerID] = useState(props.playerID || '')
  const UIState = {
    menuOpen,
    playerID,
  }
  const setUIState = {
    setMenuOpen,
    setPlayerID,
  }
  return (
    <UIContext.Provider value={[UIState, setUIState]}>
      {props.children}
    </UIContext.Provider>
  )
}

export const useUIContext = () => {
  const [UIState, setUIState] = useContext(UIContext)

  function toggleMenu() {
    setUIState.setMenuOpen((s) => !s)
  }
  return {
    ...UIState,
    ...setUIState,
    toggleMenu,
  }
}
