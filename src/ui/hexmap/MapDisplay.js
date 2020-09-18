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
  const {
    onClickMapBackground__turn,
    boardHexesToHighlight_selectedUnits,
  } = useTurnContext()
  const { onClickMapBackground__placement } = usePlacementContext()

  const handleClickMapBackground = () => {
    if (isPlacementPhase) {
      return onClickMapBackground__placement()
    }
    if (isRoundOfPlayPhase) {
      return onClickMapBackground__turn()
    }
  }

  const computedViewBox = () => {
    const phi = hexMap.hexWidth
    const Xo = -2 * phi * hexMap.mapSize
    const Yo = -2 * phi * hexMap.mapSize
    const Xt = 4 * phi * hexMap.mapSize
    const Yt = 4 * phi * hexMap.mapSize
    return `${Xo} ${Yo} ${Xt} ${Yt}`
  }

  return (
    <HexSVGStyle onClick={handleClickMapBackground} pID={playerID}>
      <HexGrid
        // width="500px"
        // height="500px"
        // viewBox={`0 0 360 360`}
        //
        // width={`${100 * (1 + Math.floor(hexMap.mapSize / 5))}%`}
        // height={`${100 * (1 + Math.floor(hexMap.mapSize / 5))}%`}
        // no viewbox
        //
        width={`100%`}
        height={`100%`}
        viewBox={computedViewBox()}
      >
        <Layout
          // size={{ x: `${hexMap.hexHeight}`, y: `${hexMap.hexHeight}` }}
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
