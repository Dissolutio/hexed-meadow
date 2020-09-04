import React, { useContext, useState } from 'react'
import { useBoardContext } from './useBoardContext'

const TurnContext = React.createContext({})

export const TurnContextProvider = ({ children }) => {
  const {
    boardHexes,
    armyCards,
    isMyTurn,
    currentTurnGameCardID,
    activeUnit,
    getBoardHexForUnitID,
    placeUnitOnHex,
    activeUnitID,
    setActiveUnitID,
    setActiveHexID,
    setErrorMsg,
  } = useBoardContext()
  const [selectedGameCardID, setSelectedGameCardID] = useState(
    initialSelectedCardID()
  )

  function initialSelectedCardID() {
    if (isMyTurn) {
      return currentTurnGameCardID
    }
    return ''
  }
  const selectedGameCard = Object.values(armyCards).find(
    (armyCard) => armyCard.gameCardID === selectedGameCardID
  )
  // const boardHexesToHighlight_selectedUnits =
  function onSelectCard__turn(gameCardID) {
    if (gameCardID === selectedGameCardID) {
      setSelectedGameCardID('')
    } else {
      setSelectedGameCardID(gameCardID)
    }
  }
  function selectMapUnit(unitID) {
    // either deselect unit, or select unit and deselect active hex
    if (unitID === activeUnitID) {
      setActiveUnitID('')
    } else {
      setActiveUnitID(unitID)
      setActiveHexID('')
    }
  }
  function onClickBoardHex__turn(event, sourceHex) {
    // Do not propagate to background onClick
    event.stopPropagation()
    const boardHex = boardHexes
    const hexID = sourceHex.id
    // hex has unit who is ready to move, select unit
    // ??

    //  No unit, select hex
    if (!activeUnitID) {
      setActiveHexID(hexID)
      setErrorMsg('')
      return
    }
    // place unit
    if (activeUnitID) {
      const oldHex = getBoardHexForUnitID(activeUnitID)
      placeUnitOnHex(hexID, activeUnit)
      setActiveUnitID('')
      setErrorMsg('')
      return
    }
    // have unit, clicked hex out of unit's move range, error
    if (activeUnitID && false) {
      setErrorMsg(
        'Invalid hex selected. Units can only move within their move range.'
      )
      return
    }
  }
  function onClickMapBackground__turn() {
    setSelectedGameCardID('')
    setActiveHexID('')
  }

  return (
    <TurnContext.Provider
      value={{
        // TURN STATE
        onClickBoardHex__turn,
        onSelectCard__turn,
        onClickMapBackground__turn,
        selectedGameCardID,
        selectedGameCard,
      }}
    >
      {children}
    </TurnContext.Provider>
  )
}

export const useTurnContext = () => {
  return {
    ...useContext(TurnContext),
  }
}
