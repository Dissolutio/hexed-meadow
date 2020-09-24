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
  default: 'var(--white)',
}

export const UnitIcon = ({ unit, iconProps, card }) => {
  if (!(unit || card)) {
    return null
  }

  let iconCardID
  let iconPlayerID
  if (card) {
    iconCardID = card.cardID
    iconPlayerID = card.playerID
  }
  if (unit) {
    iconCardID = unit.cardID
    iconPlayerID = unit.playerID
  }
  const fontSize = 10
  const iconSize = fontSize
  const iconShift = iconSize / -2

  const gameIconProps = {
    x: iconProps?.x ?? `${iconShift}px`,
    y: iconProps?.x ?? `${iconShift}px`,
    style: {
      fill: `${playerIconColors[iconPlayerID]}`,
      fontSize: iconProps?.x ?? `${iconSize}px`,
    },
  }

  switch (iconCardID) {
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
