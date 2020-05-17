import React, { useContext, useState } from 'react'

const UIContext = React.createContext({})

export const UIContextProvider = (props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [playerID, setPlayerID] = useState(props.playerID || '')
  const value = {
    menuOpen,
    playerID,
    setMenuOpen,
    setPlayerID,
  }
  return <UIContext.Provider value={value}>{props.children}</UIContext.Provider>
}

export const useUIContext = () => {
  const { menuOpen, playerID, setMenuOpen, setPlayerID } = useContext(UIContext)

  function toggleMenu() {
    setMenuOpen((s) => !s)
  }

  return {
    menuOpen,
    playerID,
    setMenuOpen,
    setPlayerID,
    toggleMenu,
  }
}
