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
  const { playerID } = props
  console.log('%c⧭', 'color: #aa00ff', playerID)
  // dispatch({ type: 'setPlayerID', payload: props.playerID })

  return (
    <BoardContext.Provider value={[state, dispatch]}>
      {props.children}
    </BoardContext.Provider>
  )
}

const useBoardContext = () => {
  const [boardState, dispatch] = useContext(BoardContext)
  return {
    boardState,
    dispatch,
  }
}

export { BoardContextProvider, useBoardContext }
