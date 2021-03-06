import React, { useRef } from 'react'
import { useBoardContext } from 'ui/hooks'
import { ReactHexgrid } from './ReactHexgrid'
import { MapHexStyles } from './MapHexStyles'
import { MapHexes } from './MapHexes'
import { TurnCounter } from './TurnCounter'
import { ZoomControls } from './ZoomControls'

export const MapDisplay = () => {
  const { G } = useBoardContext()
  const { hexMap } = G
  const mapSize = hexMap.mapSize
  const mapRef = useRef()
  const zoomInterval = 100
  const [mapState, setMapState] = React.useState(() => ({
    width: 100,
    height: 100,
    hexSize: mapSize <= 3 ? 15 : mapSize <= 5 ? 20 : mapSize <= 10 ? 25 : 25,
    spacing: 1.06,
  }))
  const handleClickZoomIn = () => {
    const el = mapRef.current
    setMapState((mapState) => ({
      ...mapState,
      width: mapState.width + zoomInterval,
      height: mapState.height + zoomInterval,
    }))
    if (el) {
      setTimeout(() => {
        const el: any = mapRef.current
        el && el.scrollBy(2 * zoomInterval, 2 * zoomInterval)
      }, 1)
    }
  }
  const handleClickZoomOut = () => {
    const el: any = mapRef.current
    setMapState((s) => ({
      ...s,
      width: s.width - zoomInterval,
      height: s.height - zoomInterval,
    }))
    el && el.scrollBy(-2 * zoomInterval, -2 * zoomInterval)
  }
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ZoomControls
        handleClickZoomIn={handleClickZoomIn}
        handleClickZoomOut={handleClickZoomOut}
      />
      <TurnCounter />
      <MapHexStyles hexSize={mapState.hexSize} ref={mapRef}>
        <ReactHexgrid
          mapSize={mapSize}
          width={`${mapState.width}%`}
          height={`${mapState.height}%`}
          hexSize={mapState.hexSize}
          spacing={mapState.spacing}
        >
          <MapHexes hexSize={mapState.hexSize} />
        </ReactHexgrid>
      </MapHexStyles>
    </div>
  )
}
