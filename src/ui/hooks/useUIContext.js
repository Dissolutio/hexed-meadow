import React, { useContext, useState } from 'react'

const UIContext = React.createContext([{}, () => {}])

export const UIContextProvider = (props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [playerID, setPlayerID] = useState('')
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
  const { menuOpen, playerID } = UIState
  const { setMenuOpen, setPlayerID } = setUIState

  function toggleMenu() {
    console.log('%c⧭', 'color: #ff0000', 'TOGLs')
    setMenuOpen((s) => !s)
  }
  return {
    menuOpen,
    playerID,
    toggleMenu,
    setMenuOpen,
    setPlayerID,
  }
}
