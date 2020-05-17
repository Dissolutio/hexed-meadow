import React, { useRef } from 'react'
import styled from 'styled-components'
import useComponentSize from '@rehooks/component-size'

import { useBoardContext } from './hooks/useBoardContext'

import { HexGrid, Layout, Hexagon } from 'react-hexgrid'
import { UnitIcon } from '../ui/UnitIcon'

export const MapDisplay = () => {
  const { playerID, mapSize, onClickMapBackground } = useBoardContext()
  let ref = useRef(null)
  let { width, height } = useComponentSize(ref)
  return (
    <HexSVGStyle ref={ref} onClick={onClickMapBackground} pID={playerID}>
      <HexGrid
        // height="100%"
        // for mapSize9 and height 100% width undefined
        // viewBox={`-35 -21 56 70`}
        // width="100%"
        // viewBox={`-5 -3 10 10`}
        viewBox={`
        ${(-width / 2) * (1 / 50)}
        ${(-height / 2) * (1 / 40)}
        ${width * (1 / 50)} 
        ${height * (1 / 40)}`}
      >
        <Layout
          size={{ x: `${3 / mapSize} `, y: `${3 / mapSize} ` }}
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
  const {
    playerID,
    currentPhase,
    boardHexes,
    gameUnits,
    armyCards,
    activeHexID,
    activeUnitID,
    onClickBoardHex,
    startZones,
  } = useBoardContext()

  const boardHexesArr = Object.values(boardHexes)
  const startZone = startZones[playerID]

  function isStartZoneHex(hex) {
    return startZone.includes(hex.id)
  }
  function isActiveHex(hex) {
    return hex.id === activeHexID
  }

  function getUnitForHex(hex) {
    const unit = gameUnits[hex?.occupyingUnitID]
    if (currentPhase === 'placementPhase' && unit?.playerID !== playerID) {
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
  return boardHexesArr.map((hex, i) => {
    return (
      <Hexagon
        key={i}
        {...hex}
        onClick={(e, source) => onClickBoardHex(e, source.props)}
        className={calcClassNames(hex)}
      >
        {}
        <UnitIcon unit={getUnitForHex(hex)} />
      </Hexagon>
    )
  })
}

const HexSVGStyle = styled.div`
  g {
    fill: var(--black);
  }
  .selectedMapHex > g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.1;
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
