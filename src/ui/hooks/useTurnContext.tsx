import React, { useContext, useState, useEffect } from 'react'
import { HexUtils } from 'react-hexgrid'

import { GameArmyCard, GameUnit, makeBlankMoveRange } from 'game/startingUnits'
import {
  getBoardHexForUnitID,
  getGameCardByID,
  getRevealedGameCard,
} from 'game/selectors'
import { useBoardContext } from './useBoardContext'

const TurnContext = React.createContext(null)

export const TurnContextProvider = ({ children }) => {
  const {
    playerID,
    G,
    ctx,
    // COMPUTED
    isMyTurn,
    isAttackingStage,
    // MOVES
    moves,
  } = useBoardContext()
  const {
    boardHexes,
    armyCards,
    gameUnits,
    orderMarkers,
    currentOrderMarker,
  } = G
  const { moveAction, attackAction } = moves
  const { currentPlayer } = ctx
  //🛠 STATE
  const [selectedGameCardID, setSelectedGameCardID] = useState('')
  const [selectedUnitID, setSelectedUnitID] = useState('')
  const currentTurnGameCardID =
    G.players?.[playerID]?.orderMarkers?.[G.currentOrderMarker] ?? ''
  //🛠 EFFECTS
  // auto select card on turn begin, auto deselect card on end turn
  useEffect(() => {
    if (isMyTurn) {
      setSelectedGameCardID(currentTurnGameCardID)
    }
    if (!isMyTurn) {
      setSelectedGameCardID('')
      setSelectedUnitID('')
    }
  }, [isMyTurn])
  // auto select card in attacking stage
  useEffect(() => {
    if (isAttackingStage) {
      setSelectedGameCardID(currentTurnGameCardID)
      setSelectedUnitID('')
    }
  }, [isAttackingStage])

  const selectedUnit = gameUnits?.[selectedUnitID]
  const revealedGameCard = getRevealedGameCard(
    orderMarkers,
    armyCards,
    currentOrderMarker,
    currentPlayer
  )
  const revealedGameCardUnits = () => {
    return Object.values(gameUnits).filter(
      (u: GameUnit) => u?.gameCardID === revealedGameCard?.gameCardID
    )
  }
  const selectedGameCard = () => {
    const armyCardsArr = Object.values(armyCards)
    const gameCard = armyCardsArr.find(
      (armyCard: GameArmyCard) => armyCard?.gameCardID === selectedGameCardID
    )
    return gameCard
  }
  const selectedGameCardUnits = () => {
    const units = Object.values(gameUnits).filter(
      (unit: GameUnit) => unit.gameCardID === selectedGameCardID
    )
    return units
  }
  function onSelectCard__turn(gameCardID: string) {
    // deselect if already selected
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
        const startHex = getBoardHexForUnitID(selectedUnitID, boardHexes)
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
        // COMPUTED
        currentTurnGameCardID,
        selectedGameCard: selectedGameCard(),
        selectedGameCardUnits: selectedGameCardUnits(),
        selectedUnit,
        revealedGameCard,
        revealedGameCardUnits: revealedGameCardUnits(),
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
