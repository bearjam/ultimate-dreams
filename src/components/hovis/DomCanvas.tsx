import {
  animated,
  SpringStartFn,
  SpringStopFn,
  SpringValue,
  to,
  useSpring,
} from "@react-spring/web"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp } from "lib/util"
import React, { PropsWithChildren } from "react"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import DomCanvasImage from "./DomCanvasImage"
import DomCanvasText from "./DomCanvasText"
import css from "./index.module.css"

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

const Canvas = ({ children, spring }: PropsWithChildren<Props>) => {
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

  const [{ dx, dy, dz }, set] = spring

  const zoomClamp = clamp(0.1, 1.5)

  const bind = useGesture(
    {
      onWheel: async ({ wheeling, movement: [, dz] }) => {
        await set({ dz })
        if (!wheeling) {
          dispatch({
            type: "UPDATE_CANVAS",
            payload: {
              scale: zoomClamp(state.scale - dz / SCALE_QUOTIENT),
            },
          })
          set({ dz: 0, immediate: true })
        }
      },
      onDrag: async ({ down, movement: [dx, dy] }) => {
        if (down) set({ dx, dy })
        else {
          await set({ dx, dy })
          dispatch({
            type: "PAN_CANVAS",
            payload: {
              dx,
              dy,
            },
          })
          set({ dx: 0, dy: 0, immediate: true })
        }
      },
    },
    {
      transform: ([x, y]) => [x, -y],
    }
  )

  return (
    <animated.div
      className={css.domCanvas}
      style={{
        width: state.width,
        height: state.height,
        x: dx.to((dx) => state.x + dx),
        y: dy.to((dy) => -state.y - dy),
        scale: to([dz], (dz) => state.scale - dz / SCALE_QUOTIENT),
      }}
      {...bind()}
    >
      {children}
    </animated.div>
  )
}

const DomCanvas = ({ spring }: Props) => {
  const items = useCanvasStore((store) => store.state.items)
  const children = pipe(
    items,
    filterWithIndex((i) => i % 2 === 0),
    map((item) => {
      switch (item.type) {
        case "IMAGE":
          return <DomCanvasImage key={item.id} item={item} />
        case "TEXT":
          return <DomCanvasText key={item.id} item={item} />
        default:
          return null
      }
    })
  )
  return <Canvas spring={spring}>{children}</Canvas>
}

export default DomCanvas
