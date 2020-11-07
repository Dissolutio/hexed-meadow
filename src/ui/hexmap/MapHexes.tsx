import React from 'react'
import { Hexagon, HexUtils, Text } from 'react-hexgrid'

import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from 'ui/icons/UnitIcon'
import { makeBlankMoveRange } from 'game/startingUnits'
import { getBoardHexForUnitID, getGameCardByID } from 'game/selectors'
import { BoardHex } from 'game/mapGen'

type MapHexesProps = {
  hexSize: number
}

export const MapHexes = ({ hexSize }: MapHexesProps) => {
  const {
    playerID,
    G,
    // computed
    isMyTurn,
    isPlacementPhase,
    isRoundOfPlayPhase,
    isAttackingStage,
    // state
    activeHexID,
    selectedUnitID,
  } = useBoardContext()
  const { boardHexes, armyCards, startZones, gameUnits } = G
  const { onClickBoardHex_placement } = usePlacementContext()
  const {
    onClickBoardHex__turn,
    selectedGameCard,
    selectedGameCardUnits,
    selectedUnit,
    revealedGameCardUnits,
  } = useTurnContext()

  //🛠 computed
  const selectedUnitMoveRange = selectedUnit?.moveRange ?? makeBlankMoveRange()

  //🛠 handlers
  const onClickBoardHex = (event, sourceHex) => {
    if (isPlacementPhase) {
      onClickBoardHex_placement(event, sourceHex)
    }
    if (isRoundOfPlayPhase) {
      onClickBoardHex__turn(event, sourceHex)
    }
  }

  // !🌠 START hex classnames
  const isStartZoneHex = (hex) => {
    const myStartZone = startZones[playerID]
    return Boolean(myStartZone.includes(hex.id))
  }

  const isSelectedPlacementHex = (hex) => {
    return isPlacementPhase && hex.id === activeHexID
  }

  const isSelectedCardUnitHex = (hex) => {
    const unitIDs = selectedGameCardUnits.map((u) => u.unitID)
    return unitIDs.includes(hex.occupyingUnitID)
  }

  const isSelectedUnitHex = (hex) => {
    return hex.occupyingUnitID && hex.occupyingUnitID === selectedUnitID
  }
  const activeEnemyUnitIDs = revealedGameCardUnits.map((u) => u.unitID)
  const isOpponentsActiveUnitHex = (hex) => {
    return activeEnemyUnitIDs.includes(hex.occupyingUnitID)
  }
  function calcClassNames(hex) {
    let classNames = ''
    //🛠 TERRAIN HEXES
    const terrainTypes = {
      grass: 'grass',
    }
    if (hex.terrain === terrainTypes.grass) {
      classNames = classNames.concat(' maphex__terrain--grass ')
    }
    //phase: Placement
    if (isPlacementPhase) {
      if (selectedUnitID && isStartZoneHex(hex)) {
        classNames = classNames.concat(' maphex__start-zone--placement ')
      }
      if (isSelectedPlacementHex(hex)) {
        classNames = classNames.concat(' maphex__selected--active ')
      }
    }
    //phase: Round of Play
    if (isRoundOfPlayPhase) {
      // THEIR TURN
      //🛠 Highlight opponents active units on their turn
      if (!isMyTurn && isOpponentsActiveUnitHex(hex)) {
        classNames = classNames.concat(' maphex__opponents-active-unit ')
      }
      // ANYONES TURN
      //🛠 Highlight selected card units
      // TODO Color selectable units based on if they have moved, have not moved, or have finished moving
      const isSelectableUnit =
        isSelectedCardUnitHex(hex) && !isSelectedUnitHex(hex)
      if (isSelectableUnit) {
        classNames = classNames.concat(
          ' maphex__selected-card-unit--selectable '
        )
      }
      //🛠 Highlight selected unit
      if (selectedUnitID && isSelectedUnitHex(hex)) {
        classNames = classNames.concat(' maphex__selected-card-unit--active ')
      }
      // MY ATTACK
      if (isAttackingStage) {
        //🛠 Highlight targetable enemy units
        const endHexUnitID = hex.occupyingUnitID
        const isEndHexOccupied = Boolean(endHexUnitID)
        const endHexUnit = { ...gameUnits[endHexUnitID] }
        const endHexUnitPlayerID = endHexUnit.playerID
        const isEndHexEnemyOccupied =
          isEndHexOccupied && endHexUnitPlayerID !== playerID
        // If unit selected, hex is enemy occupied...
        if (selectedUnitID && isEndHexEnemyOccupied) {
          const startHex = getBoardHexForUnitID(selectedUnitID, boardHexes)
          const isInRange =
            HexUtils.distance(startHex, hex) <= selectedGameCard.range
          // ... and is in range
          if (isInRange) {
            classNames = classNames.concat(' maphex__targetable-enemy ')
          }
        }
      }

      // MY MOVE
      if (!isAttackingStage) {
        const { safe, engage, disengage } = selectedUnitMoveRange
        const isInSafeMoveRange = safe.includes(hex.id)
        const isInEngageMoveRange = engage.includes(hex.id)
        const isInDisengageMoveRange = disengage.includes(hex.id)
        //🛠 Paint safe moves
        if (isInSafeMoveRange) {
          classNames = classNames.concat(' maphex__move-safe ')
        }
        //🛠 Paint engage moves
        if (isInEngageMoveRange) {
          classNames = classNames.concat(' maphex__move-engage ')
        }
        //🛠 Paint disengage moves
        if (isInDisengageMoveRange) {
          classNames = classNames.concat(' maphex__move-disengage ')
        }
      }
    }

    return classNames
  }
  //!🌠 END hex classnames
  const hexJSX = () => {
    return Object.values(boardHexes).map((hex: BoardHex, i) => {
      const gameUnit = gameUnits?.[hex.occupyingUnitID]
      const gameUnitCard = getGameCardByID(armyCards, gameUnit?.gameCardID)
      const unitName = gameUnitCard?.name ?? ''
      return (
        <Hexagon
          key={i}
          {...hex}
          onClick={(e, source) => onClickBoardHex(e, source.props)}
          className={calcClassNames(hex)}
        >
          <g>
            {gameUnit && (
              <UnitIcon
                hexSize={hexSize}
                cardID={gameUnit.cardID}
                iconPlayerID={gameUnit.playerID}
              />
            )}
            {isPlacementPhase && <HexIDText hexSize={hexSize} text={hex.id} />}
            {!isPlacementPhase && (
              <HexIDText hexSize={hexSize} text={unitName} />
            )}
          </g>
        </Hexagon>
      )
    })
  }
  return <>{hexJSX()}</>
}
const HexIDText = ({ hexSize, text }) => {
  return (
    <Text className="maphex_altitude-text" y={hexSize * 0.6}>
      {text.toString()}
    </Text>
  )
}
