import React from 'react'
import {
  GiBee,
  GiWaspSting,
  GiCrown,
  GiButterfly,
  GiFairyWings,
  GiWingedEmblem,
} from 'react-icons/gi'
import { useBoardContext } from './hooks/useBoardContext'

export const playerIconColors = {
  0: 'var(--bee-yellow)',
  1: 'var(--butterfly-purple)',
}

export const UnitIcon = ({ unit, iconProps }) => {
  const { hexMap } = useBoardContext()
  const { x = '-2', y = '-2', fontSize = '0.2rem' } = iconProps ? iconProps : {}
  if (!unit) return null
  const playerColor = playerIconColors[unit?.playerID] ?? 'red'

  const gameIconProps = {
    x,
    y,
    style: {
      fill: `${playerColor}`,
      fontSize,
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
