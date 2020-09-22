import React from 'react'
import styled from 'styled-components'

import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'

import { Hexagon, HexUtils } from 'react-hexgrid'
import { UnitIcon } from 'ui/UnitIcon'

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
  } = useTurnContext()

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
  const getMoveRangeStatusForHex = (hex) => {
    const unit = gameUnits[selectedUnitID]
    const movePoints = unit.movePoints
    const startHexID = getBoardHexIDForUnitID(selectedUnitID)
    const distance = HexUtils.distance(boardHexes[startHexID], hex)
    const isOutOfMoveRange = distance > movePoints
    const isOccupied = Boolean(hex.occupyingUnitID)

    // ! IMPROVED MOVE PATHING
    const firstNeighbors = HexUtils.neighbours(hex)
    const paths = firstNeighbors.reduce(
      (prev, curr, index) => {
        console.log(`pathing${index}`, curr)
        prev.safe.push(curr.id)
        return prev
      },
      { safe: [], engage: [], disengage: [] }
    )
    //! *

    if (isOutOfMoveRange || isOccupied) {
      return ''
    }
    // return moveStatuses.disengage
    // return moveStatuses.engage
    return moveStatuses.safely
  }

  function calcClassNames(hex) {
    let classNames = ''
    // ! Placement
    if (isPlacementPhase) {
      if (activeUnitID && isStartZoneHex(hex)) {
        classNames = classNames.concat(' maphex__start-zone--placement ')
      }
      if (isActiveHex(hex)) {
        classNames = classNames.concat(' maphex__selected--active ')
      }
    }
    // ! Round of Play
    if (isRoundOfPlayPhase) {
      //! Highlight selectable - NO UNIT
      if (isSelectedCardUnitHex(hex) && !selectedUnitID) {
        classNames = classNames.concat(
          ' maphex__selected-card-unit--selectable '
        )
      }
      //! Highlight coselections - UNIT
      if (isSelectedCardUnitHex(hex) && selectedUnitID) {
        classNames = classNames.concat(' maphex__coselected-unit ')
      }
      if (selectedUnitID) {
      }
      // Highlight selected unit hex
      if (isSelectedUnitHex(hex)) {
        classNames = classNames.concat(' maphex__selected-card-unit--active ')
      }
      if (
        selectedUnitID &&
        getMoveRangeStatusForHex(hex) === moveStatuses.safely
      ) {
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
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
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
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
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
    stroke: var(--sub-white);
    stroke-width: 0.3;
    @media screen and (min-width: 500px) {
      stroke-width: 0.4;
    }
  }
  /* HIGHLIGHT SELECTED UNIT */
  .maphex__selected-card-unit--active > g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.4;
    @media screen and (min-width: 500px) {
      stroke-width: 0.5;
    }
  }
`
