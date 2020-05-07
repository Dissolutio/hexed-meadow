import React, { useContext, useState } from 'react'

const BoardContext = React.createContext([{}, () => {}])

const BoardContextProvider = (props) => {
  const [activeHexID, setActiveHexID] = useState('')
  const [activeUnitID, setActiveUnitID] = useState('')

  const boardState = {
    activeHexID,
    activeUnitID,
  }
  const setBoardState = {
    setActiveHexID,
    setActiveUnitID,
  }

  return (
    <BoardContext.Provider value={[boardState, setBoardState]}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const [boardState, setBoardState] = useContext(BoardContext)
  const { activeHexID, activeUnitID } = boardState
  const { setActiveHexID, setActiveUnitID } = setBoardState
  // When user switches contest, we adjust the selected date to be within the contest dates

  return {
    activeHexID,
    setActiveHexID,
    activeUnitID,
    setActiveUnitID,
  }
}

export { BoardContextProvider, useBoardContext }
