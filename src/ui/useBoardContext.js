import React, { useContext, useReducer } from 'react'

const BoardContext = React.createContext([{}, () => {}])

const initialState = {
  playerID: '',
}
function reducer(state, action) {
  switch (action.type) {
    case 'setPlayerID':
      return { ...state, playerID: action.payload }
    default:
      return state
  }
}

const BoardContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { playerID } = state
  return (
    <BoardContext.Provider value={[state, dispatch]}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const [state, dispatch] = useContext(BoardContext)

  const { playerID } = state
  const setPlayerID = (id) => {
    dispatch({ type: 'setPlayerID', payload: id })
  }
  return {
    playerID,
    setPlayerID,
  }
}

export { BoardContextProvider, useBoardContext }
