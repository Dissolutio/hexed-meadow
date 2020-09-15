import React from 'react'
import styled from 'styled-components'

import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'

import { Hexagon } from 'react-hexgrid'
import { UnitIcon } from 'ui/UnitIcon'
import { phaseNames } from 'game/constants'

export const MapHexes = () => {
  const {
    // G
    boardHexes,
    gameUnits,
    startZones,
    // ctx
    playerID,
    currentPhase,
    isPlacementPhase,
    // state
    activeHexID,
    activeUnitID,
  } = useBoardContext()
  const { onClickBoardHex_placement } = usePlacementContext()
  const { onClickBoardHex__turn } = useTurnContext()

  const startZone = startZones[playerID]

  const onClickBoardHex = (event, sourceHex) => {
    if (currentPhase === phaseNames.placement)
      return onClickBoardHex_placement(event, sourceHex)
    if (currentPhase === phaseNames.roundOfPlay)
      return onClickBoardHex__turn(event, sourceHex)
  }

  function isStartZoneHex(hex) {
    return startZone.includes(hex.id)
  }

  function isActiveHex(hex) {
    return hex.id === activeHexID
  }

  function getUnitForHex(unitID) {
    if (!unitID) {
      return
    }
    const unit = gameUnits[unitID]
    // don't return opponent-controlled units during placement
    if (currentPhase === 'placement' && unit?.playerID !== playerID) {
      return
    }
    return unit
  }

  function calcClassNames(hex) {
    let classNames = ''
    if (isPlacementPhase && activeUnitID && isStartZoneHex(hex)) {
      classNames += ' maphex__start-zone--placement '
    }
    if (isActiveHex(hex)) {
      classNames += ' maphex__selected--active '
    }
    if (isActiveHex(hex)) {
      classNames += ' maphex__selected--active '
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
  /* HEX FILL */
  g {
    fill: var(--black);
  }

  /* REGULAR HEXES */
  svg g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.01;
  }

  /* SELECTED HEXES */
  .maphex__selected--active > g polygon {
    /* 
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    */
    stroke: var(--neon-orange);
    stroke-width: 0.1;
    @media screen and (min-width: 500px) {
      stroke-width: 0.3;
    }
  }

  /* STARTZONE HEX */
  .maphex__start-zone--placement > g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.1;
  }

  /* HOVERED HEX */
  @media (hover: hover) {
    svg g:hover {
      fill: var(--neon-orange);
      fill-opacity: 0.6;
    }
  }
`
