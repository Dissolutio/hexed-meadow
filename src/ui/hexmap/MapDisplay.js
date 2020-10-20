import React, { useRef } from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/esm/Button'
import { HiOutlineZoomIn, HiOutlineZoomOut } from 'react-icons/hi'

import { useBoardContext, usePlacementContext } from 'ui/hooks'
import { ReactHexgrid } from './ReactHexgrid'
import { MapHexes } from './MapHexes'

export const MapDisplay = () => {
  const { isPlacementPhase, hexMap } = useBoardContext()
  const { onClickMapBackground__placement } = usePlacementContext()
  const { mapSize } = hexMap
  const mapRef = useRef()
  const zoomInterval = 100

  const [mapState, setMapState] = React.useState({
    width: 100,
    height: 100,
    hexSize: mapSize <= 3 ? 15 : mapSize <= 5 ? 20 : mapSize <= 10 ? 25 : 25,
    spacing: 1.06,
  })

  const handleClickMapBackground = () => {
    if (isPlacementPhase) {
      return onClickMapBackground__placement()
    }
  }

  const handleClickZoomIn = () => {
    const el = mapRef.current
    setMapState((mapState) => ({
      ...mapState,
      width: mapState.width + zoomInterval,
      height: mapState.height + zoomInterval,
    }))
    if (el) {
      setTimeout(() => {
        const el = mapRef.current
        el && el.scrollBy(2 * zoomInterval, 2 * zoomInterval)
      }, 1)
    }
  }

  const handleClickZoomOut = () => {
    const el = mapRef.current
    setMapState((s) => ({
      ...s,
      width: s.width - zoomInterval,
      height: s.height - zoomInterval,
    }))
    if (el) {
      el.scrollBy(-2 * zoomInterval, -2 * zoomInterval)
    }
  }

  const mapProps = {
    mapSize,
    width: `${mapState.width}%`,
    height: `${mapState.height}%`,
    hexSize: mapState.hexSize,
    spacing: mapState.spacing,
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ZoomControls
        mapState={mapState}
        setMapState={setMapState}
        handleClickZoomIn={handleClickZoomIn}
        handleClickZoomOut={handleClickZoomOut}
      />
      <StyledReactHexgrid
        onClick={handleClickMapBackground}
        hexSize={mapState.hexSize}
        ref={mapRef}
      >
        <ReactHexgrid mapProps={mapProps}>
          <MapHexes hexSize={mapState.hexSize} />
        </ReactHexgrid>
      </StyledReactHexgrid>
    </div>
  )
}

const StyledReactHexgrid = styled.div`
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

  //🛠 Hex Highlighting

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
    stroke: var(--white);
    stroke-width: 0.6;
  }
  /* HIGHLIGHT SELECTED UNIT */
  .maphex__selected-card-unit--active > g polygon {
    stroke: var(--player-color);
    stroke-width: 0.6;
  }
  /* HIGHLIGHT CO-SELECTED UNIT */
  .maphex__coselected-unit > g polygon {
    stroke: var(--sub-white);
    stroke-width: 0.6;
  }
  //🛠 PAINT MOVE HEXES
  /* PAINT SAFE MOVERANGE */
  .maphex__move-safe > g {
    fill: var(--neon-green);
  }
  /* PAINT ENGAGE MOVERANGE */
  .maphex__move-engage > g {
    fill: var(--neon-orange);
  }
  /* PAINT DISENGAGE MOVERANGE */
  .maphex__move-disengage > g {
    fill: var(--neon-red);
  }
`

//🛠 DEV MAP TOOL
const ZoomControls = ({ handleClickZoomIn, handleClickZoomOut }) => {
  return (
    <StyledZoomControls>
      <Button size="sm" variant="dark" onClick={handleClickZoomOut}>
        <HiOutlineZoomOut fill="transparent" stroke="var(--player-color)" />
      </Button>
      <Button size="sm" variant="dark" onClick={handleClickZoomIn}>
        <HiOutlineZoomIn fill="transparent" stroke="var(--player-color)" />
      </Button>
    </StyledZoomControls>
  )
}
const StyledZoomControls = styled.span`
  position: absolute;
  top: 0%;
  left: 0%;
  padding-top: 36px;
  padding-left: 36px;
  z-index: 2;
  button {
    background-color: var(--gunmetal-transparent);
  }
  svg {
    width: 30px;
    height: 30px;
  }
`
