import React from 'react'
import { Hexagon, Text } from 'react-hexgrid'

import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'
import { UnitIcon } from 'ui/UnitIcon'
import { makeBlankMoveRange } from 'game/startingUnits'

export const MapHexes = ({ hexSize }) => {
  const {
    playerID,
    boardHexes,
    startZones,
    getMapHexUnit,
    isMyTurn,
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
    const selectedCardBoardHexIDArr = selectedGameCardUnits.map(
      (unit) => unit?.boardHexID ?? ''
    )
    return selectedCardBoardHexIDArr.includes(hex.id)
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
    //phase: Placement
    if (isPlacementPhase) {
      if (activeUnitID && isStartZoneHex(hex)) {
        classNames = classNames.concat(' maphex__start-zone--placement ')
      }
      if (isSelectedPlacementHex(hex)) {
        classNames = classNames.concat(' maphex__selected--active ')
      }
    }
    //phase: Round of Play
    if (isRoundOfPlayPhase) {
      //🛠 Highlight opponents active units on their turn
      if (!isMyTurn && isOpponentsActiveUnitHex(hex)) {
        classNames = classNames.concat(' maphex__opponents-active-unit ')
      }
      //🛠 Highlight selectable units
      if (!selectedUnitID && isSelectedCardUnitHex(hex)) {
        classNames = classNames.concat(
          ' maphex__selected-card-unit--selectable '
        )
      }
      //🛠 Highlight selected unit
      if (selectedUnitID && isSelectedUnitHex(hex)) {
        classNames = classNames.concat(' maphex__selected-card-unit--active ')
      }
      //🛠 Highlight coselected units
      if (isSelectedCardUnitHex(hex) && selectedUnitID) {
        classNames = classNames.concat(' maphex__coselected-unit ')
      }

      //🛠 Paint safe moves
      const isInSafeMoveRange = selectedUnitMoveRange.safe.includes(hex.id)
      if (isInSafeMoveRange) {
        classNames = classNames.concat(' maphex__move-safe ')
      }
      //🛠 Paint engage moves
      const isInEngageMoveRange = selectedUnitMoveRange.engage.includes(hex.id)
      if (isInEngageMoveRange) {
        classNames = classNames.concat(' maphex__move-engage ')
      }
      //🛠 Paint disengage moves
      const isInDisengageMoveRange = selectedUnitMoveRange.disengage.includes(
        hex.id
      )
      if (isInDisengageMoveRange) {
        classNames = classNames.concat(' maphex__move-disengage ')
      }
    }

    return classNames
  }
  //!🌠 END hex classnames

  return Object.values(boardHexes).map((hex, i) => {
    const gameUnit = getMapHexUnit(hex)
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
          <HexIDText hexSize={hexSize} text={hex.occupyingUnitID} />
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
