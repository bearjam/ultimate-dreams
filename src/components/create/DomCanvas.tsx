import { animated } from "@react-spring/web"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp } from "lib/util"
import React, { PropsWithChildren } from "react"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import { Vector2 } from "types/geometry"
import { CanvasProps } from "./CanvasCommon"
import DomCanvasImage from "./DomCanvasImage"
import DomCanvasText from "./DomCanvasText"
import css from "./index.module.css"

const Canvas = ({ children, canvasSpring }: PropsWithChildren<CanvasProps>) => {
  const [
    { width, height, ...state },
    dispatch,
  ] = useCanvasStore(
    ({ state: { width, height, translate, scale }, dispatch }) => [
      { width, height, translate, scale },
      dispatch,
    ]
  )

  const [{ translate, scale }, set] = canvasSpring

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
    <animated.div
      className={css.domCanvas}
      style={
        {
          width,
          height,
          translate,
          scale,
        } as any
      }
      {...bind()}
    >
      {children}
    </animated.div>
  )
}

const DomCanvas = ({ canvasSpring }: CanvasProps) => {
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
  return <Canvas canvasSpring={canvasSpring}>{children}</Canvas>
}

export default DomCanvas
