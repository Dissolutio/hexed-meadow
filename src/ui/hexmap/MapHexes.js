import React from 'react'
import styled from 'styled-components'

import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'

import { Hexagon, HexUtils } from 'react-hexgrid'
import { UnitIcon } from 'ui/UnitIcon'
import { getMoveRangeForUnit } from 'game/game'
import { baseMoveRange } from 'game/startingUnits'

const moveStatuses = {
  safely: 'safely',
  disengage: 'disengage',
  engage: 'engage',
}

export const MapHexes = () => {
  const {
    playerID,
    boardHexes,
    gameUnits,
    startZones,
    getBoardHexIDForUnitID,
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
        {gameUnit ? <UnitIcon unit={gameUnit} /> : null}
      </Hexagon>
    )
  })
}

export const HexSVGStyle = styled.div`
  height: 100%;

  /* HIGHLIGHT ALL HEXES */
  svg g polygon {
    stroke: var(--player-color);
    stroke-width: 0.01;
  }

  /* PAINT ALL HEXES */
  .hexagon-group {
    fill: var(--black);
    @media (hover: hover) {
      &:hover {
        fill: var(--neon-orange);
        fill-opacity: 0.6;
      }
    }
  }

  /* PAINT SAFE MOVE END */
  .maphex__move-safely > g {
    fill: var(--green);
  }

  /* HIGHLIGHT STARTZONE HEX */
  .maphex__start-zone--placement > g polygon {
    stroke: var(--player-color);
    stroke-width: 0.1;
    @media screen and (min-width: 500px) {
      stroke-width: 0.3;
    }
  }
  /* HIGHLIGHT SELECTED HEXES */
  .maphex__selected--active > g polygon {
    stroke: var(--white);
    stroke-width: 0.1;
    @media screen and (min-width: 500px) {
      stroke-width: 0.3;
    }
  }
  /* HIGHLIGHT MOVEABLE UNITS */
  .maphex__selected-card-unit--selectable > g polygon {
    stroke: var(--white);
    stroke-width: 0.3;
    @media screen and (min-width: 500px) {
      stroke-width: 0.4;
    }
  }
  .maphex__coselected-unit > g polygon {
    stroke: var(--white);
    stroke-width: 0.3;
    @media screen and (min-width: 500px) {
      stroke-width: 0.4;
    }
  }
  /* HIGHLIGHT SELECTED UNIT */
  .maphex__selected-card-unit--active > g polygon {
    stroke: var(--player-color);
    stroke-width: 0.4;
    @media screen and (min-width: 500px) {
      stroke-width: 0.5;
    }
  }
`
