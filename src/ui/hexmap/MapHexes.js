import React from 'react'
import { Hexagon, Text } from 'react-hexgrid'

import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from 'ui/UnitIcon'
import { getMoveRangeForUnit } from 'game/game'
import { baseMoveRange } from 'game/startingUnits'

export const MapHexes = ({ hexSize }) => {
  const {
    playerID,
    boardHexes,
    gameUnits,
    startZones,
    isPlacementPhase,
    isRoundOfPlayPhase,
    activeHexID,
    activeUnitID,
  } = useBoardContext()

  const { onClickBoardHex_placement } = usePlacementContext()
  const {
    onClickBoardHex__turn,
    selectedGameCardUnits,
    selectedUnitID,
    selectedUnit,
  } = useTurnContext()

  //🛠 computed
  const moveRange = () =>
    selectedUnit ? getMoveRangeForUnit(selectedUnit, boardHexes) : baseMoveRange

  //🛠 handlers
  const onClickBoardHex = (event, sourceHex) => {
    if (isPlacementPhase) {
      onClickBoardHex_placement(event, sourceHex)
    }
    if (isRoundOfPlayPhase) {
      onClickBoardHex__turn(event, sourceHex)
    }
  }

  function isStartZoneHex(hex) {
    const myStartZone = startZones[playerID]
    return Boolean(myStartZone.includes(hex.id))
  }

  function getUnitForHex(unitID) {
    if (!unitID) {
      return
    }
    const unit = gameUnits[unitID]
    // don't return opponent-controlled units during placement
    if (isPlacementPhase && unit?.playerID !== playerID) {
      return
    }
    return unit
  }

  function isActiveHex(hex) {
    return isPlacementPhase && hex.id === activeHexID
  }

  const isSelectedCardUnitHex = (hex) => {
    const selectedCardBoardHexIDArr = selectedGameCardUnits.map(
      (unit) => unit?.boardHexID ?? ''
    )
    return selectedCardBoardHexIDArr.includes(hex.id)
  }

  const isSelectedUnitHex = (hex) => {
    return hex.occupyingUnitID && hex.occupyingUnitID === selectedUnitID
  }

  function calcClassNames(hex) {
    let classNames = ''
    //phase: Placement
    if (isPlacementPhase) {
      if (activeUnitID && isStartZoneHex(hex)) {
        classNames = classNames.concat(' maphex__start-zone--placement ')
      }
      if (isActiveHex(hex)) {
        classNames = classNames.concat(' maphex__selected--active ')
      }
    }
    //phase: Round of Play
    if (isRoundOfPlayPhase) {
      //🛠 Highlight selected units when none selected
      if (isSelectedCardUnitHex(hex) && !selectedUnitID) {
      }
      //🛠 Highlight selected unit's selectable squad mates
      if (isSelectedCardUnitHex(hex) && selectedUnitID) {
        classNames = classNames.concat(' maphex__coselected-unit ')
      }
      //🛠 Highlight selected unit hex...
      if (isSelectedUnitHex(hex)) {
        classNames = classNames.concat(' maphex__selected-card-unit--active ')
      } else if (isSelectedCardUnitHex(hex)) {
        //🛠 ...and highlight un-selected but selectable units...
        classNames = classNames.concat(
          ' maphex__selected-card-unit--selectable '
        )
      }
      //🛠 Paint safe moves for selected unit
      const isInSafeRange = moveRange()?.safely?.includes(hex.id) ?? false
      if (selectedUnitID && isInSafeRange) {
        classNames = classNames.concat(' maphex__move-safely ')
      }
    }
    return classNames
  }

  return Object.values(boardHexes).map((hex, i) => {
    const gameUnit = getUnitForHex(hex.occupyingUnitID)
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
          <HexIDText hexSize={hexSize} text={hex.id} />
        </g>
      </Hexagon>
    )
  })
}

const HexIDText = ({ hexSize, text }) => {
  return (
    <Text className="maphex_altitude-text" y={hexSize * 0.6}>
      {text.toString()}
    </Text>
  )
}
