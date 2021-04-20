import { SCALE_QUOTIENT } from "lib/constants"
import { springConfig } from "lib/util"
import React from "react"
import { animated, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import { CanvasTextItem, GestureHandlers } from "types/canvas"
import css from "./index.module.css"

type Props = {
  item: CanvasTextItem
}

const DomCanvasText = ({ item }: Props) => {
  const [{ mode, scale }, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { text, width, height } = item

  const [{ x, y, z }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
    config: springConfig,
  }))

  function getHandlers(): GestureHandlers {
    switch (mode) {
      case "MOVE":
        return {
          onDrag: async ({ event, down, movement }) => {
            event.stopPropagation()
            event.preventDefault()
            const [mx, my] = movement.map((v) => (1 / scale) * v)
            if (down) {
              set({ x: mx, y: my })
            } else {
              await set({ x: 0, y: 0, immediate: true })
              dispatch({
                type: "MOVE_ITEM",
                payload: { itemId: item.id, dx: mx, dy: my },
              })
            }
          },
        }
      default:
        return {
          onDrag: () => {},
        }
    }
  }

  const bind = useGesture(getHandlers())

  return (
    <animated.div
      className={css.domCanvasItem}
      style={{
        width,
        height,
        x: x.to((x) => item.translate[0] + x),
        y: y.to((y) => item.translate[1] + y),
        scale: z.to((z) => item.scale - z / SCALE_QUOTIENT),
      }}
      {...bind()}
    >
      {text}
    </animated.div>
  )
}

export default DomCanvasText
