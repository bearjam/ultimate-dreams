import clsx from "clsx"
import { SCALE_QUOTIENT } from "lib/constants"
import { HTMLProps, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { animated, to, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import shallow from "zustand/shallow"
import { useCanvasStore } from "../../stores/canvas"
import css from "./Canvas.module.css"
import CanvasImage from "./CanvasImage"
import CanvasText from "./CanvasText"
const { abs } = Math

const Canvas = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const { items, mode, dispatch, pan, zoom } = useCanvasStore(
    ({ state: { items, mode, pan, zoom }, dispatch }) => ({
      items,
      mode,
      dispatch,
      pan,
      zoom,
    }),
    shallow
  )

  const [{ x, y, z }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
    config: {
      duration: 0,
    },
  }))

  const bind = useGesture({
    onDrag: ({ movement: [mx, my], down }) => {
      if (down) {
        set({ x: mx, y: my })
      } else {
        dispatch({ type: "UPDATE_PAN", payload: { dx: mx, dy: my } })
        set({ x: 0, y: 0 })
      }
    },
    onWheel: ({ movement: [_, my], wheeling }) => {
      if (wheeling) {
        set({ z: my })
      } else {
        dispatch({
          type: "UPDATE_ZOOM",
          payload: { zoom: zoom - my / SCALE_QUOTIENT },
        })
        set({ z: 0 })
      }
    },
  })

  const mainRef = useRef<HTMLDivElement | null>(null)

  const getCenter = () => {
    if (typeof window === "undefined") return [0, 0]
    return [window.innerWidth / 2, window.innerHeight / 2]
  }

  const center = () => {
    const main = mainRef.current
    if (!main) return
    const rect = main.getBoundingClientRect()
    const [targetX, targetY] = getCenter()
    const currentX = rect.left + abs(rect.left - rect.right) / 2
    const currentY = rect.top + abs(rect.top - rect.bottom) / 2
    dispatch({
      type: "UPDATE_PAN",
      payload: {
        dx: -1 * (currentX - targetX),
        dy: -1 * (currentY - targetY),
      },
    })
  }

  useHotkeys("c", center)

  return (
    <div className={clsx(css.container, className)} {...props}>
      <animated.div
        className={css.main}
        style={{
          width: 4000,
          height: 4000,
          scale: to([z], (z) => (z ? zoom - z / SCALE_QUOTIENT : zoom)),
          x: to([x], (x) => pan.x + x),
          y: to([y], (y) => pan.y + y),
        }}
        {...bind()}
        ref={mainRef}
      >
        {items.map((item) => {
          switch (item.type) {
            case "IMAGE":
              return <CanvasImage key={item.id} item={item} mode={mode} />
            case "TEXT":
              return <CanvasText key={item.id} item={item} mode={mode} />
            default:
              return null
          }
        })}
      </animated.div>
    </div>
  )
}

export default Canvas
