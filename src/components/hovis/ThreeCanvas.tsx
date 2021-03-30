import { to, useSpring } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import React from "react"
import { Canvas as R3FCanvas } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import { clamp } from "../../lib/util"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

const ThreeBackdrop = () => {
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

  const [{ x, y, wheelY }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    wheelY: 0,
  }))

  const zoomClamp = clamp(0.1, 1.5)

  const bind = useGesture(
    {
      onWheel: async ({ wheeling, movement: [, movementY] }) => {
        await set({ wheelY: movementY })
        if (!wheeling) {
          dispatch({
            type: "UPDATE_CANVAS",
            payload: {
              scale: zoomClamp(state.scale - movementY / SCALE_QUOTIENT),
            },
          })
          set({ wheelY: 0, immediate: true })
        }
      },
      onDrag: async ({ down, movement: [x, y] }) => {
        if (down) set({ x, y })
        else {
          await set({ x, y })
          dispatch({
            type: "PAN_CANVAS",
            payload: {
              dx: x,
              dy: y,
            },
          })
          set({ x: 0, y: 0, immediate: true })
        }
      },
    },
    {
      transform: ([x, y]) => [x, -y],
    }
  )

  const scale = to([wheelY], (my) =>
    zoomClamp(state.scale - my / SCALE_QUOTIENT)
  ).to((x) => [x, x, x])

  const position = to([x, y], (x, y) => [state.x + x, state.y + y, 0])

  return (
    <animated.mesh scale={scale as any} position={position as any} {...bind()}>
      <planeBufferGeometry args={[state.width, state.height]} />
      <meshBasicMaterial color="green" />
    </animated.mesh>
  )
}

const ThreeCanvas = () => {
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
    <R3FCanvas orthographic className="pointer-events-none">
      <ThreeBackdrop />
      {children}
    </R3FCanvas>
  )
}

export default ThreeCanvas
