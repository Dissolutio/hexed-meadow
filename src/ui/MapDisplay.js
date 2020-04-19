import React from 'react'
import styled from 'styled-components'
import { HexGrid, Layout, Hexagon, HexUtils } from 'react-hexgrid'
import { UnitIcon } from '../ui/UnitIcon'

export function MapDisplay({ mapProps }) {
    const {
        playerID,
        boardHexes,
        startZones,
        mapSize,
        zoomLevel,
        armyCards,
        gameUnits,
        activeHexID,
        activeUnitID,
        onClickBoardHex,
        onClickMapBackground,
    } = mapProps

    const boardHexesArr = Object.values(boardHexes)
    const originFactor = -10
    const sizeFactor = 25
    return (
        <HexSVGStyle onClick={onClickMapBackground}>
            <HexGrid
                // width={`${mapSize * 200}`}
                // height={`${mapSize * 221}`}
                // viewBox={`${mapSize * originFactor} ${mapSize * originFactor} ${mapSize * sizeFactor} ${mapSize * sizeFactor}`}
                width="100%"
                // height="100%"
                viewBox={`-7 -7 14 14`}
            >
                <Layout
                    // size={{ x: `${zoomLevel}`, y: `${zoomLevel}` }}
                    size={{ x: `1`, y: `1` }}
                    flat={true}
                    origin={{ x: 0, y: 0 }}
                    spacing={1.01}
                >
                    <Hexes
                        playerID={playerID}
                        boardHexesArr={boardHexesArr}
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
        boardHexesArr,
        gameUnits,
        armyCards,
        activeHexID,
        activeUnitID,
        onClickBoardHex,
        startZones,
    } = props

    const startZone = startZones[playerID]

    function isStartZoneHex(hex) {
        return startZone.includes(hex.id)
    }
    function isActiveHex(hex) {
        return hex.id === activeHexID
    }

    function getUnitForHex(hex) {
        return gameUnits[hex?.occupyingUnitID]
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
    color: var(--light-blue);
    g {
        fill: var(--light-blue);
    }
    .selectedMapHex > g {
        fill: var(--neon-green);
    }
    .startZoneHex > g {
        fill: var(--neon-green);
    }
    svg g polygon {
        stroke: var(--dark-blue);
        stroke-width: 0.2;
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
