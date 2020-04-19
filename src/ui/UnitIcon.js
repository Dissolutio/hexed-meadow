import React from 'react'
import { GiButterfly, GiBee } from 'react-icons/gi'

export const playerIconColors = {
  0: 'var(--bee-yellow)',
  1: 'var(--butterfly-purple)',
}

export const UnitIcon = ({ unit }) => {
  if (!unit) return null
  const playerColor = playerIconColors[unit?.playerID] ?? 'red'
  const gameIconProps = {
    x: '-0.55',
    y: '-0.55',
    style: {
      fill: `${playerColor}`,
      fontSize: '0.07rem',
      transform: 'translate(30, 0)',
    },
  }
  switch (unit.cardID) {
    case 'hm101':
      return <GiBee {...gameIconProps} />
    case 'hm102':
      return <GiBee {...gameIconProps} />
    case 'hm103':
      return <GiBee {...gameIconProps} />
    case 'hm201':
      return <GiButterfly {...gameIconProps} />
    case 'hm202':
      return <GiButterfly {...gameIconProps} />
    case 'hm203':
      return <GiButterfly {...gameIconProps} />
    default:
      return null
  }
}
