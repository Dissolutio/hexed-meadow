import React, { useContext, useState } from 'react'
import { useBoardContext } from './useBoardContext'
import { gameUnits } from 'game/startingUnits'

const TurnContext = React.createContext({})

export const TurnContextProvider = ({ children }) => {
  const {
    // WIP
    currentTurnGameCardID,
    // G
    boardHexes,
    armyCards,
    gameUnits,
    // MOVES
    placeUnitOnHex,
    // PLAYER STATE
    isMyTurn,
    // SELECTORS
    getGameCardByID,
    // APP STATE
    activeHexID,
    activeUnitID,
    setActiveUnitID,
    activeUnit,
    getBoardHexForUnitID,
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
    // DESELECT IF ALREADY SELECTED
    if (gameCardID === selectedGameCardID) {
      setSelectedGameCardID('')
      return
    }
    if (activeHexID) setSelectedGameCardID(gameCardID)
    return
  }
  function onClickBoardHex__turn(event, sourceHex) {
    // Do not propagate to background onClick
    event.stopPropagation()
    //
    const hexID = sourceHex.id
    const boardHex = boardHexes[hexID]
    const { occupyingUnitID } = boardHex
    const unitOnHex = gameUnits[occupyingUnitID]
    const gameCard = getGameCardByID(unitOnHex?.gameCardID)

    // ?? hex has unit who is ready to move, select unit

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
        // COMPUTED
        // HANDLERS
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
