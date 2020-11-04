declare module 'react-hexgrid' {
  class Point {
    constructor(x: number, y: number)
    readonly x: number
    readonly y: number
  }
  class Hex {
    constructor(q: number, r: number, s: number)
    readonly q: number
    readonly r: number
    readonly s: number
  }
  type HexagonProps = {
    q: number
    r: number
    s: number
    fill?: string
    cellStyle?: string | {}
    className?: string
    data?: {}
    onMouseEnter?: React.EventHandler
    onMouseOver?: React.EventHandler
    onMouseLeave?: React.EventHandler
    onClick?: React.EventHandler
    onDragStart?: React.EventHandler
    onDragEnd?: React.EventHandler
    onDragOver?: React.EventHandler
    onDrop?: React.EventHandler
    children?: React.ReactNode
  }

  const Hexagon: React.FC<HexagonProps> = (props) => React.ReactNode
  type TextProps = {
    children: React.ReactNode
    x?: string | number
    y?: string | number
    className?: string
  }
  const Text: React.FC<TextProps> = (props) => React.ReactNode

  class Orientation {
    constructor(
      f0: number,
      f1: number,
      f2: number,
      f3: number,
      b0: number,
      b1: number,
      b2: number,
      b3: number,
      startAngle: number
    )
    static f0: number
    static f1: number
    static f2: number
    static f3: number
    static b0: number
    static b1: number
    static b2: number
    static b3: number
    static startAngle: number
  }
  interface LayoutProps {
    flat: boolean
    origin: Hex
    size: Point
    spacing: number
  }
  class Layout extends React.Component {
    private LAYOUT_FLAT: Orientation
    private LAYOUT_POINTY: Orientation
    static propTypes: {
      children: React.ReactChildren
      className: string
      LayoutProps
    }
    static defaultProps: {
      flat: boolean
      origin: Point
      size: Point
      spacing: number
    }
    static childContextTypes: {
      layout: any
      points: string
    }
    private getChildContext: () => {
      layout: any
      points: string
    }
    private getPointOffset: (
      corner: number,
      orientation: Orientation,
      size: number
    ) => Point
    private calculateCoordinates: (orientation: Orientation) => Point[]
    readonly render: () => React.ReactNode
  }
  class HexUtils {
    static equals: (a: Hex, b: Hex) => Hex
    static add: (a: Hex, b: Hex) => Hex
    static subtract: (a: Hex, b: Hex) => Hex
    static multiply: (a: Hex, b: Hex) => Hex
    static lengths: (a: Hex, b: Hex) => Hex
    static distance: (a: Hex, b: Hex) => number
    static direction: (direction: number) => Hex
    static neighbour: (hex: Hex, direction: number) => Hex
    static neighbours: (hex: Hex) => Hex[]
    private round: (hex: Hex) => Hex // turns q,r,s of hex to integers (for pixelToHex)
    static hexToPixel: (hex: Hex, layout: any) => Point
    static pixelToHex: (point: Point, layout: any) => Hex
    private lerp: (a: number, b: number, t: number) => number
    static hexLerp: (a: Hex, b: Hex, t: number) => Hex
  }
  class GridGenerator {
    static getGenerator: (string) => () => any
    static ring: (center: Hex, mapRadius: number) => Hex[]
    static spiral: (center: Hex, mapRadius: number) => Hex[]
    static parallelogram: (
      q1: number,
      q2: number,
      r1: number,
      r2: number
    ) => Hex[]
    static triangle: (mapSize: number) => Hex[]
    static hexagon: (mapRadius: number) => Hex[]
    static rectangle: (mapWidth: number, mapHeight: number) => Hex[]
    static orientedRectangle: (mapWidth: number, mapHeight: number) => Hex[]
  }
  type HexGridProps = {
    width: string | number
    height: string | number
    viewBox: string
  }
  const HexGrid: React.FC<HexGridProps> = (props) => {}
}
