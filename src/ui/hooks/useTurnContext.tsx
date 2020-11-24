import React, {
  createContext,
  SyntheticEvent,
  useContext,
  useEffect,
} from 'react'
import { HexUtils } from 'react-hexgrid'

import { GameArmyCard, GameUnit, makeBlankMoveRange } from 'game/startingUnits'
import { selectHexForUnit, selectRevealedGameCard } from 'game/selectors'
import { useBoardContext } from './useBoardContext'
import { BoardHex } from 'game/mapGen'

const TurnContext = createContext<Partial<TurnContextValue>>({})

type TurnContextValue = {
  // computed
  currentTurnGameCardID: string
  selectedUnit: GameUnit
  revealedGameCard: GameArmyCard
  revealedGameCardUnits: GameUnit[]
  selectedGameCard: GameArmyCard
  selectedGameCardUnits: GameUnit[]
  // handlers
  onSelectCard__turn: (gameCardID: string) => void
  onClickBoardHex__turn: (
    event: React.SyntheticEvent,
    sourceHex: BoardHex
  ) => void
}

export const TurnContextProvider = ({ children }) => {
  const {
    // BGIO board props
    playerID,
    G,
    ctx,
    moves,
    //STATE
    selectedUnitID,
    setSelectedUnitID,
    selectedGameCardID,
    setSelectedGameCardID,
    // COMPUTED
    isMyTurn,
    isAttackingStage,
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

  const currentTurnGameCardID =
    G.players?.[playerID]?.orderMarkers?.[G.currentOrderMarker] ?? ''
  //🛠 EFFECTS
  useEffect(() => {
    // auto select card on turn begin
    if (isMyTurn) {
      // auto select card AND deselect units on attack begin
      if (isAttackingStage) {
        setSelectedGameCardID(currentTurnGameCardID)
        setSelectedUnitID('')
      }
      setSelectedGameCardID(currentTurnGameCardID)
    }
    //  auto deselect card/units on end turn
    if (!isMyTurn) {
      setSelectedGameCardID('')
      setSelectedUnitID('')
    }
  }, [
    isMyTurn,
    isAttackingStage,
    currentTurnGameCardID,
    setSelectedGameCardID,
    setSelectedUnitID,
  ])
  //🛠 COMPUTED
  const selectedUnit = gameUnits?.[selectedUnitID]
  const revealedGameCard = selectRevealedGameCard(
    orderMarkers,
    armyCards,
    currentOrderMarker,
    currentPlayer
  )
  const revealedGameCardUnits = Object.values(gameUnits).filter(
    (u: GameUnit) => u?.gameCardID === revealedGameCard?.gameCardID
  )
  const selectedGameCard = Object.values(armyCards).find(
    (armyCard: GameArmyCard) => armyCard?.gameCardID === selectedGameCardID
  )
  const selectedGameCardUnits = Object.values(gameUnits).filter(
    (unit: GameUnit) => unit.gameCardID === selectedGameCardID
  )
  //🛠 HANDLERS
  function onSelectCard__turn(gameCardID: string) {
    // deselect if already selected
    if (gameCardID === selectedGameCardID) {
      setSelectedGameCardID('')
      return
    }
    setSelectedGameCardID(gameCardID)
    return
  }
  function onClickBoardHex__turn(event: SyntheticEvent, sourceHex: BoardHex) {
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
        const startHex = selectHexForUnit(selectedUnitID, boardHexes)
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
        // COMPUTED
        currentTurnGameCardID,
        selectedGameCard,
        selectedGameCardUnits,
        selectedUnit,
        revealedGameCard,
        revealedGameCardUnits,
        // HANDLERS
        onClickBoardHex__turn,
        onSelectCard__turn,
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
