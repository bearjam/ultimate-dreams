import clsx from "clsx"
import SvgCloseIcon from "icons/SvgCloseIcon"
import { SCALE_QUOTIENT } from "lib/constants"
import { HTMLProps, useEffect, useRef, useState } from "react"
import { animated, to, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import shallow from "zustand/shallow"
import SvgPlusIcon from "../../icons/SvgPlusIcon"
import { useCanvasStore } from "../../stores/canvas"
import { CanvasImageItem, CanvasTextItem } from "../../types/canvas"
import Text from "../Text"
import css from "./Canvas.module.css"
import CanvasImage from "./CanvasImage"
import PhotoBin from "./PhotoBin"
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

  const [showPhotoBin, setShowPhotoBin] = useState(false)
  const closePhotoBin = () => void setShowPhotoBin(false)
  const openPhotoBin = () => void setShowPhotoBin(true)

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

  const containerClickHandler = () => {
    const main = mainRef.current
    if (!main) return
    const rect = main.getBoundingClientRect()
    console.log(rect)
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

  // useEffect(() => void logRect(), [pan])

  return (
    <div
      className={clsx(css.container, className)}
      onClick={containerClickHandler}
      {...props}
    >
      {!showPhotoBin ? (
        <button onClick={openPhotoBin}>
          <SvgPlusIcon />
        </button>
      ) : (
        <div className={css["photo-bin-popup"]}>
          <PhotoBin onDispatch={closePhotoBin} />
          <button aria-label="close" onClick={closePhotoBin}>
            <SvgCloseIcon />
          </button>
        </div>
      )}
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
        {items.map(
          (item) =>
            ({
              IMAGE: (
                <CanvasImage key={item.id} {...(item as CanvasImageItem)} />
              ),
              TEXT: <Text key={item.id} {...(item as CanvasTextItem)} />,
            }[item.type])
        )}
      </animated.div>
    </div>
  )
}

export default Canvas
