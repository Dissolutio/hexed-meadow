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

export const UnitIcon = ({ cardID, hexSize, iconProps, iconPlayerID }) => {
  if (!cardID) {
    return null
  }

  const iconSize = hexSize || 10
  const iconXShift = iconSize / -2
  const iconYShift = iconSize / -1.5

  const gameIconProps = {
    x: iconProps?.x ?? `${iconXShift}px`,
    y: iconProps?.x ?? `${iconYShift}px`,
    style: {
      fill: `${playerIconColors?.[iconPlayerID] ?? 'var(--white)'}`,
      fontSize: iconProps?.x ?? `${iconSize}px`,
    },
  }

  switch (cardID) {
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
