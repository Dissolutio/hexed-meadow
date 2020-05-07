import React, { useContext, useState } from 'react'

const BoardContext = React.createContext([{}, () => {}])

const BoardContextProvider = (props) => {
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')
  const [topConsoleComponent, setTopConsoleComponent] = useState('NavBar')
  const [bottomConsoleComponent, setBottomConsoleComponent] = useState(
    'PlacementControls'
  )

  const boardState = {
    activeHexID,
    activeUnitID,
    topConsoleComponent,
    bottomConsoleComponent,
  }
  const setBoardState = {
    setActiveHexID,
    setActiveUnitID,
    setTopConsoleComponent,
    setBottomConsoleComponent,
  }

  return (
    <BoardContext.Provider value={[boardState, setBoardState]}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const [boardState, setBoardState] = useContext(BoardContext)
  const activateDataReadout = () =>
    setBoardState.setBottomConsoleComponent('DataReadout')
  const activatePlacementControls = () =>
    setBoardState.setBottomConsoleComponent('PlacementControls')
  return {
    ...boardState,
    ...setBoardState,
    activatePlacementControls,
    activateDataReadout,
  }
}

export { BoardContextProvider, useBoardContext }
