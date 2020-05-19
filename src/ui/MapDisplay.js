import React, { useRef } from 'react'
import styled from 'styled-components'
import useComponentSize from '@rehooks/component-size'

import { useBoardContext } from './hooks/useBoardContext'
import { usePlacementContext } from './hooks/usePlacementContext'

import { HexGrid, Layout, Hexagon } from 'react-hexgrid'
import { UnitIcon } from '../ui/UnitIcon'

export const MapDisplay = () => {
  const { playerID, hexMap, onClickMapBackground } = useBoardContext()

  let ref = useRef(null)
  let { width, height } = useComponentSize(ref)
  const longSide = width >= height ? width : height
  return (
    <HexSVGStyle ref={ref} onClick={onClickMapBackground} pID={playerID}>
      <HexGrid width="100%" height="100%" viewBox="-5 -5 10 10">
        <Layout
          size={{ x: `${hexMap.mapSize * 2}`, y: `${hexMap.mapSize * 2} ` }}
          flat={true}
          origin={{ x: 0, y: 0 }}
          spacing={1.01}
        >
          <Hexes />
        </Layout>
      </HexGrid>
    </HexSVGStyle>
  )
}

const Hexes = (props) => {
  const { onClickBoardHex_placement } = usePlacementContext()

  const {
    playerID,
    currentPhase,
    boardHexes,
    gameUnits,
    armyCards,
    activeHexID,
    activeUnitID,
    onClickBoardHex_mainGame,
    startZones,
  } = useBoardContext()

  const onClickBoardHex = (event, sourceHex) => {
    if (currentPhase === 'placement')
      return onClickBoardHex_placement(event, sourceHex)
    if (currentPhase === 'mainGame')
      return onClickBoardHex_mainGame(event, sourceHex)
  }

  const startZone = startZones[playerID]

  function isStartZoneHex(hex) {
    return startZone.includes(hex.id)
  }
  function isActiveHex(hex) {
    return hex.id === activeHexID
  }

  function getUnitForHex(hex) {
    const unitID = hex?.occupyingUnitID
    if (!unitID) return
    const unit = gameUnits[unitID]
    // hide opposing units during placement
    if (currentPhase === 'placement' && unit?.playerID !== playerID) {
      return {}
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
    return (
      <Hexagon
        key={i}
        {...hex}
        onClick={(e, source) => onClickBoardHex(e, source.props)}
        className={calcClassNames(hex)}
      >
        {getUnitForHex(hex) ? <UnitIcon unit={getUnitForHex(hex)} /> : null}
      </Hexagon>
    )
  })
}

const HexSVGStyle = styled.div`
  g {
    fill: var(--black);
  }
  .selectedMapHex > g polygon {
    /* 
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    */
    stroke: var(--neon-orange);
    stroke-width: 0.1;
    @media screen and (min-width: 500px) {
      stroke-width: 0.5;
    }
  }
  .startZoneHex > g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.1;
  }
  /* REGULAR HEXES */
  svg g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.01;
  }
  @media (hover: hover) {
    svg g:hover {
      fill: var(--neon-orange);
      fill-opacity: 0.6;
    }
  }
`
