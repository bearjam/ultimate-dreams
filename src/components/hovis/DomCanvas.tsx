import { animated, to, useSpring } from "@react-spring/web"
import { pipe } from "fp-ts/function"
import { filter, filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp } from "lib/util"
import React, { ReactNode } from "react"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import DomCanvasImage from "./DomCanvasImage"
import DomCanvasText from "./DomCanvasText"
import css from "./index.module.css"

type Props = {
  children: ReactNode
}

const Canvas = ({ children }: Props) => {
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
    wheelY: 0,
    x: 0,
    y: 0,
  }))

  const zoomClamp = clamp(0.1, 1.5)

  const bind = useGesture(
    {
      onWheel: async ({ wheeling, movement: [, dy] }) => {
        await set({ wheelY: dy })
        if (!wheeling) {
          dispatch({
            type: "UPDATE_CANVAS",
            payload: {
              scale: zoomClamp(state.scale - dy / SCALE_QUOTIENT),
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

  return (
    <animated.div
      className={css.domCanvas}
      style={{
        width: state.width,
        height: state.height,
        x: x.to((x) => state.x + x),
        y: y.to((y) => -state.y - y),
        scale: to([wheelY], (dy) => state.scale - dy / SCALE_QUOTIENT),
      }}
      {...bind()}
    >
      {children}
    </animated.div>
  )
}

const DomCanvas = () => {
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
  return <Canvas>{children}</Canvas>
}

export default DomCanvas
