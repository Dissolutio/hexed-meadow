import React, { useContext, useState } from 'react'
import { useBoardContext } from './useBoardContext'

const TurnContext = React.createContext({})

export const TurnContextProvider = ({ children }) => {
  const {
    boardHexes,
    gameUnits,
    armyCards,
    playerID,
    myUnits,
    myCards,
    activeUnit,
    getBoardHexForUnitID,
    placeUnitOnHex,
    activeUnitID,
    setActiveUnitID,
    activeHexID,
    setActiveHexID,
    setErrorMsg,
  } = useBoardContext()
  const [selectedGameCardID, setSelectedGameCardID] = useState(
    initialSelectedCardID
  )
  function initialSelectedCardID() {
    // TODO lookup card for current order marker and default select that card, most actions of "going" back will go back to it being selected
    return ''
  }

  function onSelectCard__turn(gameCardID) {
    if (gameCardID === selectedGameCardID) {
      setSelectedGameCardID('')
    } else {
      setSelectedGameCardID(gameCardID)
    }
  }

  const selectedGameCard = Object.values(armyCards).find(
    (armyCard) => armyCard.gameCardID === selectedGameCardID
  )

  function onClickUnit__turn(unitID) {
    console.log(`functiononClickUnit__turn -> unitID`, unitID)
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

    const hexID = sourceHex.id
    console.log(`functiononClickBoardHex__turn -> sourceHex.id`, sourceHex.id)
    // hex has unit who is ready to move, select unit

    //  No unit, select hex
    if (!activeUnitID) {
      setActiveHexID(hexID)
      console.log(`Before / After`, activeUnitID, ',', hexID)
      setErrorMsg('')
      return
    }
    // place unit
    if (activeUnitID) {
      const oldHex = getBoardHexForUnitID(activeUnitID)
      console.log(`functiononClickBoardHex__turn -> oldHex`, oldHex)
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

  return (
    <TurnContext.Provider
      value={{
        // TURN STATE
        onClickBoardHex__turn,
        onClickUnit__turn,
        onSelectCard__turn,
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
