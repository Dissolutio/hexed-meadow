import React, { useRef } from 'react'
import styled from 'styled-components'
import { useBoardContext, usePlacementContext } from 'ui/hooks'
import { ReactHexgrid } from './ReactHexgrid'
import { MapHexes } from './MapHexes'
import { TurnCounter } from './TurnCounter'
import { ZoomControls } from './ZoomControls'

export const MapDisplay = () => {
  const { isPlacementPhase, G } = useBoardContext()
  const { hexMap } = G
  const mapSize = hexMap.mapSize
  const mapRef = useRef()
  const zoomInterval = 100
  const [mapState, setMapState] = React.useState(() => ({
    width: 100,
    height: 100,
    hexSize: mapSize <= 3 ? 15 : mapSize <= 5 ? 20 : mapSize <= 10 ? 25 : 25,
    spacing: 1.06,
  }))
  const handleClickZoomIn = () => {
    const el = mapRef.current
    setMapState((mapState) => ({
      ...mapState,
      width: mapState.width + zoomInterval,
      height: mapState.height + zoomInterval,
    }))
    if (el) {
      setTimeout(() => {
        const el: any = mapRef.current
        el && el.scrollBy(2 * zoomInterval, 2 * zoomInterval)
      }, 1)
    }
  }
  const handleClickZoomOut = () => {
    const el: any = mapRef.current
    setMapState((s) => ({
      ...s,
      width: s.width - zoomInterval,
      height: s.height - zoomInterval,
    }))
    el && el.scrollBy(-2 * zoomInterval, -2 * zoomInterval)
  }
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ZoomControls
        handleClickZoomIn={handleClickZoomIn}
        handleClickZoomOut={handleClickZoomOut}
      />
      <TurnCounter />
      <StyledReactHexgrid hexSize={mapState.hexSize} ref={mapRef}>
        <ReactHexgrid
          mapSize={mapSize}
          width={`${mapState.width}%`}
          height={`${mapState.height}%`}
          hexSize={mapState.hexSize}
          spacing={mapState.spacing}
        >
          <MapHexes hexSize={mapState.hexSize} />
        </ReactHexgrid>
      </StyledReactHexgrid>
    </div>
  )
}
type StyledReactHexgridProps = {
  hexSize: number
}
const StyledReactHexgrid = styled.div<StyledReactHexgridProps>`
  height: 100%;
  position: relative;
  overflow: scroll;
  //🛠 Targets the react-hexgrid svg wrapper
  svg.grid {
    position: absolute;
    top: 0%;
    left: 0%;
  }
  //🛠 Style scrollbars
  scrollbar-width: thin;
  scrollbar-color: var(--player-color) var(--black);
  &::-webkit-scrollbar {
    height: 0.7rem;
    width: 0.7rem;
    background: var(--black);
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    box-shadow: inset 0 0 1px var(--player-color);
    background: var(--black);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--player-color);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-corner {
    background: var(--black);
  }

  //🛠 Style Hex Text
  .maphex_altitude-text {
    fill: var(--sub-white);
    font-size: ${(props) => `${props.hexSize / 75}rem`};
  }
  //🛠 Terrain Highlighting
  .maphex__terrain--grass > g polygon {
    fill: var(--neon-green);
    fill-opacity: 0.2;
  }

  //🛠 Hex Highlighting

  /* HIGHLIGHT ALL HEXES */
  svg g polygon {
    stroke: var(--player-color);
    stroke-width: 0.01;
  }

  /* PAINT ALL HEXES */
  .hexagon-group {
    fill: var(--black);
    g polygon {
      @media (hover: hover) {
        &:hover {
          fill: var(--neon-orange);
          fill-opacity: 0.6;
        }
      }
    }
  }

  /* HIGHLIGHT STARTZONE HEX */
  .maphex__start-zone--placement > g polygon {
    stroke: var(--player-color);
    stroke-width: 0.6;
  }
  /* HIGHLIGHT SELECTED HEXES */
  .maphex__selected--active > g polygon {
    stroke: var(--white);
    stroke-width: 0.6;
  }
  /* HIGHLIGHT SELECTABLE UNITS */
  .maphex__selected-card-unit--selectable > g polygon {
    stroke: var(--sub-white);
    stroke-width: 0.6;
  }
  /* HIGHLIGHT SELECTED UNIT */
  .maphex__selected-card-unit--active > g polygon {
    stroke: var(--player-color);
    stroke-width: 0.6;
  }
  /* HIGHLIGHT ACTIVE ENEMY UNIT */
  .maphex__opponents-active-unit > g polygon {
    stroke: var(--neon-red);
    stroke-width: 0.6;
  }
  //🛠 PAINT MOVE HEXES
  /* PAINT SAFE MOVERANGE */
  .maphex__move-safe > g polygon {
    fill: var(--neon-green);
    fill-opacity: 1;
  }
  /* PAINT ENGAGE MOVERANGE */
  .maphex__move-engage > g {
    fill: var(--neon-orange);
    fill-opacity: 1;
  }
  /* PAINT DISENGAGE MOVERANGE */
  .maphex__move-disengage > g {
    fill: var(--neon-red);
    fill-opacity: 1;
  }
  //🛠 PAINT ATTACK HEXES
  /* PAINT TARGETABLE ENEMY UNIT */
  .maphex__targetable-enemy > g polygon {
    fill: var(--neon-red);
    fill-opacity: 1;
  }
`
