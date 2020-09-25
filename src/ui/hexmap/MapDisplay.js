import React from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/esm/Button'
import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'
import { ReactHexgrid } from './ReactHexgrid'
import { MapHexes } from './MapHexes'

export const MapDisplay = () => {
  const { isPlacementPhase, isRoundOfPlayPhase, hexMap } = useBoardContext()
  const { onClickMapBackground__placement } = usePlacementContext()
  const { onClickMapBackground__turn } = useTurnContext()
  const { mapSize } = hexMap

  const mapRef = React.useRef()
  const zoomInterval = 100

  const [state, setState] = React.useState({
    width: 100,
    height: 100,
    hexSize: 15,
    spacing: 1.06,
  })

  const handleClickMapBackground = () => {
    if (isPlacementPhase) {
      return onClickMapBackground__placement()
    }
    if (isRoundOfPlayPhase) {
      return onClickMapBackground__turn()
    }
  }

  const handleClickZoomIn = () => {
    const el = mapRef.current
    setState((state) => ({
      ...state,
      width: state.width + zoomInterval,
      height: state.height + zoomInterval,
    }))
    if (el) {
      const initYPos = mapRef.current?.scrollTop
      const initXPos = mapRef.current?.scrollLeft
      el.scrollBy(zoomInterval, zoomInterval)
    }
  }

  const handleClickZoomOut = () => {
    const el = mapRef.current
    setState((s) => ({
      ...s,
      width: s.width - zoomInterval,
      height: s.height - zoomInterval,
    }))
    if (el) {
      const initYPos = mapRef.current?.scrollTop
      const initXPos = mapRef.current?.scrollLeft
      el.scrollBy(-zoomInterval, -zoomInterval)
    }
  }

  const mapProps = {
    mapSize,
    width: `${state.width}%`,
    height: `${state.height}%`,
    hexSize: state.hexSize,
    spacing: state.spacing,
  }

  return (
    <>
      <StyledReactHexgrid
        onClick={handleClickMapBackground}
        hexSize={state.hexSize}
        ref={mapRef}
      >
        <MapControls
          state={state}
          setState={setState}
          handleClickZoomIn={handleClickZoomIn}
          handleClickZoomOut={handleClickZoomOut}
        />
        <ReactHexgrid mapProps={mapProps}>
          <MapHexes hexSize={state.hexSize} />
        </ReactHexgrid>
      </StyledReactHexgrid>
    </>
  )
}
export const StyledReactHexgrid = styled.div`
  height: 100%;
  position: relative;
  overflow-x: auto;
  overflow-y: scroll;
  /* So the map controls don't push map down */
  svg {
    position: absolute;
    top: 0%;
    left: 0%;
  }
  //🛠 Style scrollbars
  ::-webkit-scrollbar {
    width: 0.5rem;
    background: var(--black);
  }
  &::-webkit-scrollbar-track-piece {
    border-radius: 10px;
    box-shadow: inset 0 0 5px var(--player-color);
    width: 0.5rem;
  }
  &::-webkit-scrollbar-corner {
    background: var(--black);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--player-color);
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
  /* HIGHLIGHT CO-SELECTED UNIT */
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

//🛠 DEV MAP TOOL
const MapControls = ({ handleClickZoomIn, handleClickZoomOut }) => {
  return (
    <StyledMapControls>
      <Button size="sm" variant="light" onClick={handleClickZoomOut}>
        ➖🔍
      </Button>
      <Button size="sm" variant="light" onClick={handleClickZoomIn}>
        ➕🔍
      </Button>
    </StyledMapControls>
  )
}
const StyledMapControls = styled.div`
  position: sticky;
  top: 0%;
  left: 0%;
  padding-top: 36px;
  padding-left: 36px;
  z-index: 10;
`
