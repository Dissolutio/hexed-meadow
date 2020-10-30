import React, { useContext, useState, useEffect } from 'react'

import { GameArmyCard, GameUnit, makeBlankMoveRange } from 'game/startingUnits'
import { useBoardContext } from './useBoardContext'
import { OrderMarker } from 'game/constants'
import { getBoardHexForUnit } from '../../game/selectors'
import { HexUtils } from 'react-hexgrid'

const TurnContext = React.createContext(null)

export const TurnContextProvider = ({ children }) => {
  const {
    playerID,
    // G
    boardHexes,
    armyCards,
    gameUnits,
    orderMarkers,
    unitsMoved,
    // COMPUTED
    myOrderMarkers,
    currentOrderMarker,
    currentPlayer,
    isMyTurn,
    isAttackingStage,
    // SELECTORS
    getGameCardByID,
    getGameUnitByID,
    getBoardHexIDForUnitID,
    currentTurnGameCardID,
    // STATE
    setActiveHexID,
    // MOVES
    moveAction,
    attackAction,
  } = useBoardContext()

  // ! STATE
  const [selectedGameCardID, setSelectedGameCardID] = useState('')
  const [selectedUnitID, setSelectedUnitID] = useState('')

  //🛠 auto select my turn card, auto deselect card on end turn
  useEffect(() => {
    if (isMyTurn) {
      setSelectedGameCardID(currentTurnGameCardID)
    }
    if (!isMyTurn) {
      setSelectedGameCardID('')
      setSelectedUnitID('')
    }
  }, [isMyTurn, currentTurnGameCardID])
  //🛠 auto select my turn card in attacking stage
  useEffect(() => {
    if (isAttackingStage) {
      setSelectedGameCardID(currentTurnGameCardID)
      setSelectedUnitID('')
    }
  }, [isAttackingStage])

  const selectedUnit = getGameUnitByID(selectedUnitID)

  const revealedGameCard = (): GameArmyCard => {
    const orderMarker = orderMarkers[currentPlayer].find(
      (om: OrderMarker) => om.order === currentOrderMarker.toString()
    )
    const id = orderMarker ? orderMarker.gameCardID : ''
    return id ? getGameCardByID(id) : null
  }
  const revealedGameCardUnits = () => {
    const gameCard = revealedGameCard()
    const units = Object.values(gameUnits).filter(
      (u: GameUnit) => u?.gameCardID === gameCard?.gameCardID
    )
    return units
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
    event.stopPropagation()
    const boardHex = boardHexes[sourceHex.id]
    const occupyingUnitID = boardHex.occupyingUnitID
    const isEndHexOccupied = Boolean(occupyingUnitID)
    const unitOnHex: GameUnit = { ...gameUnits[occupyingUnitID] }
    const endHexUnitPlayerID = unitOnHex.playerID
    const isUnitReadyToSelect =
      unitOnHex?.gameCardID === selectedGameCardID &&
      selectedGameCardID === currentTurnGameCardID
    const isUnitSelected = unitOnHex?.unitID === selectedUnitID

    //🛠 MOVE STAGE
    if (isMyTurn && !isAttackingStage) {
      const moveRange = selectedUnit?.moveRange ?? makeBlankMoveRange()
      const { safe, engage, disengage } = moveRange
      const allMoves = [safe, disengage, engage].flat()
      const isInMoveRange = allMoves.includes(sourceHex.id)
      // move selected unit
      if (selectedUnitID && isInMoveRange && !isEndHexOccupied) {
        moveAction(selectedUnit, boardHexes[sourceHex.id])
      }
      // select unit
      if (isUnitReadyToSelect) {
        setSelectedUnitID(unitOnHex.unitID)
      }
      // deselect unit
      if (isUnitSelected) {
        setSelectedUnitID('')
      }
    }
    //🛠 ATTACK STAGE
    if (isMyTurn && isAttackingStage) {
      const isEndHexEnemyOccupied =
        isEndHexOccupied && endHexUnitPlayerID !== playerID

      // select unit
      if (isUnitReadyToSelect) {
        setSelectedUnitID(unitOnHex.unitID)
      }
      // deselect unit
      if (isUnitSelected) {
        setSelectedUnitID('')
      }
      // attack with selected unit
      if (selectedUnitID && isEndHexEnemyOccupied) {
        const startHex = getBoardHexForUnit(selectedUnit, boardHexes)
        const gameCard: any = Object.values(armyCards).find(
          (armyCard: GameArmyCard) =>
            armyCard?.gameCardID === selectedGameCardID
        )
        const isInRange =
          HexUtils.distance(startHex, boardHex) <= gameCard?.range ?? false
        if (isInRange) {
          attackAction(selectedUnit, boardHexes[sourceHex.id])
        }
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
        revealedGameCardUnits: revealedGameCardUnits(),
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
