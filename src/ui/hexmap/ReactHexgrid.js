import React from 'react'

import { HexGrid, Layout } from 'react-hexgrid'

export const ReactHexgrid = ({ mapProps, children }) => {
  const { mapSize, width, height, hexSize, spacing } = mapProps

  if (!width || !height || !hexSize || !spacing) {
    return null
  }
  const halfVB = mapSize * -50
  const fullVB = mapSize * 100
  return (
    <HexGrid
      width={width}
      height={height}
      viewBox={`${halfVB} ${halfVB} ${fullVB} ${fullVB}`}
    >
      <Layout
        size={{
          x: hexSize,
          y: hexSize,
        }}
        flat={true}
        origin={{ x: 0, y: 0 }}
        spacing={spacing}
      >
        {children}
      </Layout>
    </HexGrid>
  )
}
