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

export const UnitIcon = ({ unit, iconProps, card }) => {
  const { hexMap } = useBoardContext()
  if (!(unit || card)) return null
  let iconCardID
  let iconPlayerID
  if (card)
    if (card) {
      iconCardID = card.cardID
      iconPlayerID = card.playerID
    }
  if (unit) {
    iconCardID = unit.cardID
    iconPlayerID = unit.playerID
  }
  const iconSize = hexMap.mapSize
  const iconShift = hexMap.mapSize / -2
  const x = iconProps?.x ?? `${iconShift}px`
  const y = iconProps?.x ?? `${iconShift}px`
  const fontSize = iconProps?.x ?? `${iconSize}px`
  const playerColor = playerIconColors[iconPlayerID]
  const gameIconProps = {
    x,
    y,
    style: {
      fill: `${playerColor}`,
      fontSize,
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
