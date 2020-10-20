import React, { useContext, useState, useEffect } from 'react'

import { GameArmyCard, GameUnit, makeBlankMoveRange } from 'game/startingUnits'
import { useBoardContext } from './useBoardContext'
import { OrderMarker } from 'game/constants'

const TurnContext = React.createContext(null)

export const TurnContextProvider = ({ children }) => {
  const {
    boardHexes,
    armyCards,
    gameUnits,
    orderMarkers,
    myOrderMarkers,
    isMyTurn,
    getGameCardByID,
    getGameUnitByID,
    getBoardHexIDForUnitID,
    currentTurnGameCardID,
    currentOrderMarker,
    currentPlayer,
    // STATE
    setActiveHexID,
    // MOVES
    moveAction,
  } = useBoardContext()

  // ! STATE
  const [selectedGameCardID, setSelectedGameCardID] = useState('')
  const [selectedUnitID, setSelectedUnitID] = useState('')

  //🛠 auto select my turn card
  useEffect(() => {
    if (isMyTurn) {
      setSelectedGameCardID(currentTurnGameCardID)
    }
  }, [isMyTurn, currentTurnGameCardID])

  const selectedUnit = getGameUnitByID(selectedUnitID)

  const revealedGameCard = () => {
    const orderMarker = orderMarkers[currentPlayer].find(
      (om: OrderMarker) => om.order === currentOrderMarker.toString()
    )
    const id = orderMarker ? orderMarker.gameCardID : ''
    return id ? getGameCardByID(id) : null
  }
  const unrevealedGameCard = () => {
    const id = myOrderMarkers[currentOrderMarker]
    return id ? getGameCardByID(id) : null
  }

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
    const isUnitReadyToSelect =
      unitOnHex?.gameCardID === selectedGameCardID &&
      selectedGameCardID === currentTurnGameCardID
    const isUnitSelected = unitOnHex?.unitID === selectedUnitID
    // * repeated from moveAction function
    const isEndHexOccupied = Boolean(occupyingUnitID)
    //TURN MyTurn
    if (isMyTurn) {
      const moveRange = selectedUnit?.moveRange ?? makeBlankMoveRange()
      const { safe, engage, disengage } = moveRange
      const allMoves = [safe, disengage, engage].flat()
      const isInMoveRange = allMoves.includes(sourceHex.id)
      //🛠 unit selected, clicked valid hex, make move
      if (selectedUnitID && isInMoveRange && !isEndHexOccupied) {
        moveAction(selectedUnit, boardHexes[sourceHex.id])
      }
      //🛠 clicked another selectable unit, select that unit
      if (isUnitReadyToSelect) {
        setSelectedUnitID(unitOnHex.unitID)
      }
      //🛠 clicked currently selected unit, de-select the unit (to none selected)
      // TODO Do something else besides deselect unit
      if (isUnitSelected) {
        setSelectedUnitID('')
      }
    }
  }

  return (
    <TurnContext.Provider
      value={{
        // STATE
        selectedGameCardID,
        selectedUnitID,
        selectedGameCard: selectedGameCard(),
        selectedGameCardUnits: selectedGameCardUnits(),
        selectedUnit,
        revealedGameCard: revealedGameCard(),
        unrevealedGameCard: unrevealedGameCard(),
        // HANDLERS
        onClickBoardHex__turn,
        onSelectCard__turn,
      }}
    >
      {children}
    </TurnContext.Provider>
  )
}

export const useTurnContext = (): any => {
  return {
    ...useContext(TurnContext),
  }
}
