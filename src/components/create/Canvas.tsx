import { SCALE_QUOTIENT } from "lib/constants"
import { PropsWithChildren } from "react"
import { animated, to, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import * as M from "rematrix"
import { useCenterElement } from "src/hooks/useCenterElement"
import { springConfig } from "../../lib/util"
import { useCanvasStore } from "../../stores/canvas"
import css from "./Canvas.module.css"
import CanvasImage from "./CanvasImage"
import CanvasText from "./CanvasText"

const Canvas = () => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { items, mode, width, height } = state

  const [{ x0, y0, x1, y1, z }, set] = useSpring(() => ({
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    z: 0,
    config: springConfig,
  }))

  const handlerZ = async (z: number, acting: boolean) => {
    if (acting) {
      await set({ z })
    } else {
      const payload = { scaleDelta: z }
      await set({ z: 0, immediate: true })
      switch (mode) {
        case "MOVE":
          dispatch({
            type: "ZOOM_CANVAS",
            payload,
          })
      }
    }
  }

  const bind = useGesture({
    onDrag: async ({ initial: [x0, y0], xy: [x1, y1], down }) => {
      const scratch = { x0, y0, x1, y1 }
      if (down) {
        await set(scratch)
      } else {
        await set({ x0: 0, y0: 0, x1: 0, y1: 0, immediate: true })
        switch (mode) {
          case "SELECT":
            dispatch({ type: "SELECT_ITEMS", payload: scratch })
            break
          case "MOVE":
            dispatch({
              type: "PAN_CANVAS",
              payload: {
                dx: scratch.x1 - scratch.x0,
                dy: scratch.y1 - scratch.y0,
              },
            })
            break
        }
      }
    },
    onWheel: async ({ movement: [_, my], wheeling }) => handlerZ(my, wheeling),
    onPinch: async ({ movement: [_, my], pinching }) => handlerZ(my, pinching),
  })

  const ref = useCenterElement(mode === "MOVE")

  return (
    <div className={css.container}>
      <animated.div
        ref={ref}
        className={css.main}
        style={{
          width,
          height,
          matrix3d: to([x0, y0, x1, y1, z], (x0, y0, x1, y1, z) => {
            switch (mode) {
              case "MOVE":
                return M.multiply(
                  M.translate(state.x + (x1 - x0), state.y + (y1 - y0)),
                  M.scale(state.scale - z / SCALE_QUOTIENT)
                )
              default:
                return M.multiply(
                  M.translate(state.x, state.y),
                  M.scale(state.scale)
                )
            }
          }),
        }}
        {...bind()}
      >
        {items.map((item) => {
          switch (item.type) {
            case "IMAGE":
              return <CanvasImage key={item.id} item={item} />
            case "TEXT":
              return <CanvasText key={item.id} item={item} />
            default:
              return null
          }
        })}
      </animated.div>
    </div>
  )
}

export default Canvas
