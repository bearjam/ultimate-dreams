import { to } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import React from "react"
import { Canvas as R3FCanvas } from "react-three-fiber"
import { useCanvasStore } from "stores/canvas"
import { CanvasProps } from "./CanvasCommon"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

const ThreeBackdrop = ({
  canvasSpring: [{ scale: canvasScale, translate }],
}: CanvasProps) => {
  const { width, height } = useCanvasStore(({ state: { width, height } }) => ({
    width,
    height,
  }))

  const position = to([translate], ([x, y]) => [x, -y, 0]) as any
  const scale = canvasScale.to((v) => [v, v, 1]) as any

  return (
    <animated.mesh scale={scale} position={position}>
      <planeBufferGeometry args={[width, height]} />
      <meshBasicMaterial color="blue" opacity={0.5} />
    </animated.mesh>
  )
}

const ThreeCanvas = ({ canvasSpring }: CanvasProps) => {
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
      <ThreeBackdrop canvasSpring={canvasSpring} />
      {children}
    </R3FCanvas>
  )
}

export default ThreeCanvas
