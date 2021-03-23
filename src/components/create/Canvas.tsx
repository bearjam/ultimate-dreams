import { SCALE_QUOTIENT } from "lib/constants"
import { MutableRefObject, PropsWithChildren, useRef } from "react"
import { animated, to, useSpring } from "react-spring"
import { useKey } from "react-use"
import { useGesture } from "react-use-gesture"
import { GestureHandlers } from "types/canvas"
import { isSSR, springConfig } from "../../lib/util"
import { useCanvasStore } from "../../stores/canvas"
import css from "./Canvas.module.css"
import CanvasImage from "./CanvasImage"
import CanvasText from "./CanvasText"
const { abs } = Math

const Canvas = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { items, mode, width, height } = state
  const [{ x, y, z }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
    config: springConfig,
  }))

  function getHandlers(): GestureHandlers {
    switch (mode) {
      case "SELECT":
        return {
          onDrag: () => {},
          onWheel: () => {},
        }
      case "MOVE":
        return {
          onDrag: async ({ movement: [mx, my], down }) => {
            if (down) {
              set({ x: mx, y: my })
            } else {
              await set({ x: 0, y: 0, immediate: true })
              dispatch({ type: "PAN_CANVAS", payload: { dx: mx, dy: my } })
            }
          },
          onWheel: async ({ movement: [_, my], wheeling }) => {
            if (wheeling) {
              set({ z: my })
            } else {
              const next = state.scale - z.get() / SCALE_QUOTIENT
              await set({ z: 0, immediate: true })
              dispatch({
                type: "UPDATE_CANVAS",
                payload: { scale: next },
              })
            }
          },
        }
      default:
        return {
          onDrag: () => {},
          onWheel: () => {},
        }
    }
  }
  const bind = useGesture(getHandlers())

  const ref = useRef<HTMLDivElement | null>(null)

  const getCenter = () =>
    isSSR() ? [0, 0] : [window.innerWidth / 2, window.innerHeight / 2]

  const center = () => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const [targetX, targetY] = getCenter()
    const currentX = rect.left + abs(rect.left - rect.right) / 2
    const currentY = rect.top + abs(rect.top - rect.bottom) / 2
    dispatch({
      type: "PAN_CANVAS",
      payload: {
        dx: -1 * (currentX - targetX),
        dy: -1 * (currentY - targetY),
      },
    })
  }

  useKey("c", center)

  return (
    <div className={css.container}>
      <animated.div
        ref={ref}
        className={css.main}
        style={{
          width,
          height,
          x: x.to((x) => state.translate.x + x),
          y: y.to((y) => state.translate.y + y),
          scale: z.to((z) => state.scale - z / SCALE_QUOTIENT),
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
        {children}
      </animated.div>
    </div>
  )
}

export default Canvas
