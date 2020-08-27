import React from 'react'

import { useBoardContext } from '../hooks/useBoardContext'
import { HexGrid, Layout } from 'react-hexgrid'
import { MapHexes, HexSVGStyle } from './MapHexes'

export const MapDisplay = () => {
  const { playerID, hexMap, onClickMapBackground } = useBoardContext()

  const phi = hexMap.hexWidth
  const Xo = -2 * phi * hexMap.mapSize
  const Yo = -2 * phi * hexMap.mapSize
  const Xt = 4 * phi * hexMap.mapSize
  const Yt = 4 * phi * hexMap.mapSize
  const computedViewBox = `${Xo} ${Yo} ${Xt} ${Yt}`

  return (
    <HexSVGStyle onClick={onClickMapBackground} pID={playerID}>
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
        viewBox={computedViewBox}
      >
        <Layout
          size={{ x: `${hexMap.hexHeight}`, y: `${hexMap.hexHeight}` }}
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
