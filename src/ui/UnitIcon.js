import React from 'react'
import {
  GiBee,
  GiWaspSting,
  GiCrown,
  GiButterfly,
  GiFairyWings,
  GiWingedEmblem,
} from 'react-icons/gi'

export const playerIconColors = {
  0: 'var(--bee-yellow)',
  1: 'var(--butterfly-purple)',
}

export const UnitIcon = ({ unit, iconProps }) => {
  const {
    x = '-0.55',
    y = '-0.55',
    fontSize = '0.07rem',
    transform = 'translate(30, 0)',
  } = iconProps ? iconProps : {}
  if (!unit) return null
  const playerColor = playerIconColors[unit?.playerID] ?? 'red'

  const gameIconProps = {
    x,
    y,
    style: {
      fill: `${playerColor}`,
      fontSize,
      transform,
    },
  }
  switch (unit.cardID) {
    case 'hm101':
      return <GiBee {...gameIconProps} />
    case 'hm102':
      return <GiWaspSting {...gameIconProps} />
    case 'hm103':
      return <GiCrown {...gameIconProps} />
    case 'hm201':
      return <GiButterfly {...gameIconProps} />
    case 'hm202':
      return <GiFairyWings {...gameIconProps} />
    case 'hm203':
      return <GiWingedEmblem {...gameIconProps} />
    default:
      return null
  }
}
