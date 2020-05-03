import React from 'react'
import styled from 'styled-components'
import { HexGrid, Layout, Hexagon, HexUtils } from 'react-hexgrid'
import { UnitIcon } from '../ui/UnitIcon'

export function MapDisplay({ mapProps }) {
  const {
    playerID,
    currentPhase,
    boardHexes,
    startZones,
    mapSize,
    armyCards,
    gameUnits,
    activeHexID,
    activeUnitID,
    onClickBoardHex,
    onClickMapBackground,
  } = mapProps

  return (
    <HexSVGStyle onClick={onClickMapBackground} pID={playerID}>
      <HexGrid
        width="100%"
        // height="100%"
        // for mapSize9 and height 100% width undefined
        // viewBox={`-35 -21 56 70`}
        viewBox={`-5 -3 10 10`}
      >
        <Layout
          size={{ x: `1`, y: `1` }}
          flat={true}
          origin={{ x: 0, y: 0 }}
          spacing={1.01}
        >
          <Hexes
            playerID={playerID}
            currentPhase={currentPhase}
            boardHexes={boardHexes}
            startZones={startZones}
            gameUnits={gameUnits}
            armyCards={armyCards}
            activeHexID={activeHexID}
            onClickBoardHex={onClickBoardHex}
            activeUnitID={activeUnitID}
          />
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
  } = props

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
  svg g polygon {
    stroke: var(
      ${(props) => (props.pID === '0' ? '--bee-yellow' : '--butterfly-purple')}
    );
    stroke-width: 0.01;
  }
  svg g polygon text {
    font-size: 0.1rem;
  }
  @media (hover: hover) {
    svg g:hover {
      fill: var(--neon-orange);
      fill-opacity: 0.6;
    }
  }
`
