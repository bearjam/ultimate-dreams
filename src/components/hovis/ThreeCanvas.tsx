import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp } from "lib/util"
import React from "react"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import theme from "tailwindcss/defaultTheme"
import { Vector2 } from "types/geometry"
import { CanvasProps } from "./CanvasCommon"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

const ThreeCanvas = ({ canvasSpring }: CanvasProps) => {
  const [{ items, ...state }, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])

  const [{ translate, scale }, set] = canvasSpring

  const clampScale = clamp(0.1, 1.5)

  const bind = useGesture(
    {
      onWheel: async ({ wheeling, movement: [, wheelY] }) => {
        const next = clampScale(state.scale + wheelY / SCALE_QUOTIENT)
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
    },
    {
      transform: ([x, y]) => [x, -y],
    }
  )
  return (
    <animated.mesh
      scale={scale.to((v) => [v, v, 1]) as any}
      position={translate.to((x, y) => [x, y, 0]) as any}
      {...bind()}
    >
      <planeBufferGeometry args={[state.width, state.height]} />
      <meshBasicMaterial color={theme.colors.indigo[200]} opacity={1} />
      {pipe(
        items,
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
      )}
    </animated.mesh>
  )
}

export default ThreeCanvas
