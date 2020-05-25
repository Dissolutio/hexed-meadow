import React from 'react'
import styled from 'styled-components'

import { useBoardContext } from '../hooks/useBoardContext'
import { usePlacementContext } from '../hooks/usePlacementContext'

import { Hexagon } from 'react-hexgrid'
import { UnitIcon } from '../UnitIcon'

export const MapHexes = () => {
  const { onClickBoardHex_placement } = usePlacementContext()

  const {
    playerID,
    currentPhase,
    boardHexes,
    gameUnits,
    activeHexID,
    activeUnitID,
    onClickBoardHex_mainGame,
    startZones,
  } = useBoardContext()

  const startZone = startZones[playerID]

  const onClickBoardHex = (event, sourceHex) => {
    if (currentPhase === 'placement')
      return onClickBoardHex_placement(event, sourceHex)
    if (currentPhase === 'mainGame')
      return onClickBoardHex_mainGame(event, sourceHex)
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
    if (activeUnitID && isStartZoneHex(hex)) {
      return 'startZoneHex'
    }
    if (isActiveHex(hex)) {
      return 'selectedMapHex'
    }
    return ''
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
  .selectedMapHex > g polygon {
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
  .startZoneHex > g polygon {
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
