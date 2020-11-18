import React from 'react'
import styled from 'styled-components'

type MapHexStylesProps = {
  hexSize: number
}
export const MapHexStyles = styled.div<MapHexStylesProps>`
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
    height: 0.2rem;
    width: 0.2rem;
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

  //🛠 HIGHLIGHT PLAYER STARTZONES
  .maphex__startzone--player0 > g polygon {
    stroke: var(--bee-yellow);
    stroke-width: 0.3;
    @media screen and (max-width: 1100px) {
      stroke-width: 0.4;
    }
  }
  .maphex__startzone--player1 > g polygon {
    stroke: var(--butterfly-purple);
    stroke-width: 0.3;
    @media screen and (max-width: 1100px) {
      stroke-width: 0.4;
    }
  }
  //🛠 HIGHLIGHT PLACEABLE HEXES
  .maphex__start-zone--placement > g polygon {
    stroke: var(--player-color);
    stroke-width: 0.6;
    @media screen and (max-width: 1100px) {
      stroke-width: 0.8;
    }
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
