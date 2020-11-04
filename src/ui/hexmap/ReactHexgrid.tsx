import React from 'react'
import { HexGrid, Layout } from 'react-hexgrid'

type ReactHexgridProps = {
  mapSize: number
  width: string | number
  height: string | number
  hexSize: number
  spacing: number
  children: any
}

export const ReactHexgrid = ({
  mapSize,
  width,
  height,
  hexSize,
  spacing,
  children,
}: ReactHexgridProps) => {
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
        flat={false}
        origin={{ x: 0, y: 0 }}
        spacing={spacing}
      >
        {children}
      </Layout>
    </HexGrid>
  )
}
