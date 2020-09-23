import React, { useContext, useState, useEffect } from 'react'

import { GameArmyCard, GameUnit } from 'game/startingUnits'
import { useBoardContext } from './useBoardContext'
import { HexUtils } from 'react-hexgrid'

const TurnContext = React.createContext({})

export const TurnContextProvider = ({ children }) => {
  const {
    boardHexes,
    armyCards,
    gameUnits,
    isMyTurn,
    getGameCardByID,
    getGameUnitByID,
    getBoardHexIDForUnitID,
    currentTurnGameCardID,
    // STATE
    setActiveHexID,
    setErrorMsg,
    // MOVES
    moveAction,
  } = useBoardContext()

  // ! STATE
  const initialSelectedGameCard = () => (isMyTurn ? currentTurnGameCardID : '')
  const [selectedGameCardID, setSelectedGameCardID] = useState(
    initialSelectedGameCard()
  )

  const [selectedUnitID, setSelectedUnitID] = useState('')
  // RESET UI ON TURN START/END
  useEffect(() => {
    setSelectedGameCardID(initialSelectedGameCard())
    setSelectedUnitID('')
  }, [isMyTurn])

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
    // Prevent propagation to onClickMapBackground__turn
    event.stopPropagation()

    const occupyingUnitID = boardHexes[sourceHex.id].occupyingUnitID
    const unitOnHex: GameUnit = gameUnits[occupyingUnitID]
    const gameCard: GameArmyCard = getGameCardByID(unitOnHex?.gameCardID)
    const isUnitReadyToSelect =
      unitOnHex?.gameCardID === selectedGameCardID &&
      selectedGameCardID === currentTurnGameCardID
    const isUnitSelected = unitOnHex?.unitID === selectedUnitID
    // * repeated from moveAction function
    const startHex = boardHexes[getBoardHexIDForUnitID(selectedUnitID)]
    const isEndHexOccupied = Boolean(occupyingUnitID)
    const distance = HexUtils.distance(startHex, sourceHex)
    const movePoints = gameUnits?.[selectedUnitID]?.movePoints ?? 0
    const isInMoveRange = distance <= movePoints
    //TURN MyTurn
    if (isMyTurn) {
      //🛠 unit selected, clicked valid hex, make move
      if (selectedUnitID && isInMoveRange && !isEndHexOccupied) {
        moveAction({ unitID: selectedUnitID, endHexID: sourceHex.id })
      }
      //🛠 clicked another selectable unit, select that unit
      if (isUnitReadyToSelect) {
        setSelectedUnitID(unitOnHex.unitID)
      }
      //🛠 clicked currently selected unit, de-select the unit (to none selected)
      // TODO This could be different, or nothing
      if (isUnitSelected) {
        setSelectedUnitID('')
      }
    }
  }

  function onClickMapBackground__turn() {
    if (selectedGameCardID !== currentTurnGameCardID) {
      setSelectedGameCardID(currentTurnGameCardID)
    }
    setActiveHexID('')
  }

  return (
    <TurnContext.Provider
      value={{
        // STATE
        selectedGameCardID,
        selectedUnitID,
        selectedUnit: getGameUnitByID(selectedUnitID),
        selectedGameCard: selectedGameCard(),
        selectedGameCardUnits: selectedGameCardUnits(),
        // HANDLERS
        onClickBoardHex__turn,
        onSelectCard__turn,
        onClickMapBackground__turn,
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
