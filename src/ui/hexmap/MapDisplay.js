import React from 'react'

import { HexGrid, Layout } from 'react-hexgrid'
import { MapHexes, HexSVGStyle } from './MapHexes'
import { useBoardContext, usePlacementContext, useTurnContext } from 'ui/hooks'

export const MapDisplay = () => {
  const {
    playerID,
    hexMap,
    isPlacementPhase,
    isRoundOfPlayPhase,
  } = useBoardContext()
  const { onClickMapBackground__turn } = useTurnContext()
  const { onClickMapBackground__placement } = usePlacementContext()

  const handleClickMapBackground = () => {
    if (isPlacementPhase) {
      return onClickMapBackground__placement()
    }
    if (isRoundOfPlayPhase) {
      return onClickMapBackground__turn()
    }
  }

  return (
    <HexSVGStyle onClick={handleClickMapBackground} pID={playerID}>
      <HexGrid width={`100%`} height={`100%`}>
        <Layout
          size={{
            x: `${(10 * hexMap.hexWidth) / hexMap.mapSize}`,
            y: `${(10 * hexMap.hexHeight) / hexMap.mapSize}`,
          }}
          flat={false}
          origin={{ x: 0, y: 0 }}
          spacing={1.06}
        >
          <MapHexes />
        </Layout>
      </HexGrid>
    </HexSVGStyle>
  )
}
