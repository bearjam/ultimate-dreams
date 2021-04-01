import { to } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp } from "lib/util"
import React, { useEffect } from "react"
import { Canvas as R3FCanvas } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import theme from "tailwindcss/defaultTheme"
import { Vector2 } from "types/geometry"
import { CanvasProps } from "./CanvasCommon"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

const ThreeBackdrop = ({
  canvasSpring: [{ scale: canvasScale, translate }, set],
}: CanvasProps) => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])

  const position = to([translate], ([x, y]) => [x, -y, 0]) as any
  const scale = canvasScale.to((v) => [v, v, 1]) as any

  const clampScale = clamp(0.1, 1.5)

  const bind = useGesture({
    onWheel: async ({ wheeling, movement: [, wheelY] }) => {
      const next = clampScale(state.scale - wheelY / SCALE_QUOTIENT)
      if (wheeling) {
        set({ scale: next })
      } else {
        await set({ scale: next })
        dispatch({
          type: "UPDATE_CANVAS",
          payload: {
            scale: next,
          },
        })
      }
    },
    onDrag: async ({ down, movement: [dx, dy] }) => {
      const next = pipe(
        state.translate,
        ([x, y]) => [x + dx, y + dy] as Vector2
      )
      if (down) set({ translate: next })
      else {
        await set({ translate: next })
        dispatch({
          type: "UPDATE_CANVAS",
          payload: {
            translate: next,
          },
        })
      }
    },
  })

  return (
    <animated.mesh scale={scale} position={position} {...bind()}>
      <planeBufferGeometry args={[state.width, state.height]} />
      <meshBasicMaterial color={theme.colors.indigo[200]} opacity={1} />
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
          return (
            <ThreeCanvasImage
              key={item.id}
              item={item}
              canvasSpring={canvasSpring}
            />
          )
        case "TEXT":
          return (
            <ThreeCanvasText
              key={item.id}
              item={item}
              canvasSpring={canvasSpring}
            />
          )
        default:
          return null
      }
    })
  )

  return (
    <R3FCanvas orthographic>
      <ThreeBackdrop canvasSpring={canvasSpring} />
      {children}
    </R3FCanvas>
  )
}

export default ThreeCanvas
