import { to } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import React from "react"
import { SpringStartFn, SpringStopFn, SpringValue } from "react-spring"
import { Canvas as R3FCanvas } from "react-three-fiber"
import { useCanvasStore } from "stores/canvas"
import { clamp } from "../../lib/util"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

type CanvasTransforms = { dx: number; dy: number; dz: number }

type Springify<T> = {
  [K in keyof T]: SpringValue<T[K]>
}

type Props = {
  spring: [
    Springify<CanvasTransforms>,
    SpringStartFn<CanvasTransforms>,
    SpringStopFn<CanvasTransforms>
  ]
}

const ThreeBackdrop = ({ spring }: Props) => {
  const [{ dx, dy, dz }] = spring

  const [state, dispatch] = useCanvasStore(
    ({ state: { width, height, x, y, scale }, dispatch }) => [
      {
        width,
        height,
        x,
        y,
        scale,
      },
      dispatch,
    ]
  )

  const zoomClamp = clamp(0.1, 1.5)

  const scale = to([dz], (dz) =>
    zoomClamp(state.scale - dz / SCALE_QUOTIENT)
  ).to((v) => [v, v, v])

  const position = to([dx, dy], (x, y) => [state.x + x, state.y + y, 0])

  return (
    <animated.mesh scale={scale as any} position={position as any}>
      <planeBufferGeometry args={[state.width, state.height]} />
      <meshBasicMaterial transparent opacity={0} />
    </animated.mesh>
  )
}

const ThreeCanvas = ({ spring }: Props) => {
  const items = useCanvasStore((store) => store.state.items)

  const children = pipe(
    items,
    filterWithIndex((i) => i % 2 === 1),
    map((item) => {
      switch (item.type) {
        case "IMAGE":
          return <ThreeCanvasImage key={item.id} item={item} />
        case "TEXT":
          return <ThreeCanvasText key={item.id} item={item} />
        default:
          return null
      }
    })
  )

  return (
    <R3FCanvas orthographic className="pointer-events-none bg-transparent">
      <ThreeBackdrop spring={spring} />
      {children}
    </R3FCanvas>
  )
}

export default ThreeCanvas
