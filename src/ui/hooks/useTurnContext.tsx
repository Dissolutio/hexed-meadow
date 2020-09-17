import { GameArmyCard, GameUnit } from 'game/startingUnits'
import React, { useContext, useState } from 'react'
import { useBoardContext } from './useBoardContext'

const TurnContext = React.createContext({})

export const TurnContextProvider = ({ children }) => {
  const boardState = useBoardContext()
  const {
    boardHexes,
    armyCards,
    gameUnits,
    placeUnitOnHex,
    isMyTurn,
    getGameCardByID,
    getBoardHexIDForUnitID,
    currentTurnGameCardID,
    activeUnitID,
    setActiveUnitID,
    activeUnit,
    setActiveHexID,
    setErrorMsg,
  } = boardState

  // ! STATE
  const [selectedGameCardID, setSelectedGameCardID] = useState(
    isMyTurn ? currentTurnGameCardID : ''
  )

  const selectedGameCard = () => {
    const armyCardsArr = Object.values(armyCards)
    const gameCard = armyCardsArr.find(
      (armyCard: GameArmyCard) => armyCard?.gameCardID === selectedGameCardID
    )
    return gameCard
  }

  const selectedGameCardUnits = () => {
    const units = Object.values(gameUnits)
      .filter((unit: GameUnit) => unit.gameCardID === selectedGameCardID)
      .map((unit: GameUnit) => ({
        ...unit,
        boardHexID: getBoardHexIDForUnitID(unit.unitID),
      }))
    return units
  }

  function onSelectCard__turn(gameCardID) {
    // DESELECT IF ALREADY SELECTED
    if (gameCardID === selectedGameCardID) {
      setSelectedGameCardID('')
      return
    }
    setSelectedGameCardID(gameCardID)
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
        selectedGameCard: selectedGameCard(),
        selectedGameCardUnits: selectedGameCardUnits(),
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
