import { SCALE_QUOTIENT } from "lib/constants"
import { springConfig } from "lib/util"
import React, { Fragment } from "react"
import { animated, to, useSpring } from "react-spring/three"
import { useLoader, useThree } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import * as THREE from "three"
import { CanvasImageItem, GestureHandlers } from "types/canvas"
import ThreeResizeHandle from "./ThreeResizeHandle"

type Props = { item: CanvasImageItem }

const ThreeCanvasImage = ({ item }: Props) => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { mode } = state

  const { viewport, size } = useThree()

  const { src, width, height } = item

  const texture = useLoader(THREE.TextureLoader, src)

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
          onDrag: async ({ down, movement: [x, y] }) => {
            const { finished } = await set({ x, y })
            if (!down && finished) {
              dispatch({
                type: "MOVE_ITEM",
                payload: { itemId: item.id, dx: x, dy: y },
              })
              set({ x: 0, y: 0, immediate: true })
            }
          },
          onWheel: () => {},
        }
      case "SCALE":
        return {
          onDrag: () => {},
          onWheel: async ({ wheeling, movement: [_, z], event }) => {
            event?.stopPropagation()
            const { finished } = await set({ z: z / SCALE_QUOTIENT })
            if (!wheeling && finished) {
              dispatch({
                type: "SCALE_ITEM",
                payload: {
                  itemId: item.id,
                  scaleDelta: z / SCALE_QUOTIENT,
                },
              })
              set({ z: 0, immediate: true })
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

  const bind = useGesture(getHandlers(), {
    transform: ([x, y]) => [x / viewport.factor, -y / viewport.factor],
  })

  const position = to([x, y], (x, y) => [
    item.translate.x + x,
    item.translate.y + y,
    0,
  ])
  const scale = to([z], (z) => [item.scale + z, item.scale + z, 1])

  function modeChildren() {
    switch (mode) {
      case "SCALE":
        return [...Array(4)].map((_, i) => (
          <ThreeResizeHandle
            key={i}
            item={item}
            ord={i}
            position={position}
            scale={scale}
          />
        ))
      default:
        return null
    }
  }

  return (
    <Fragment>
      <animated.mesh
        // @ts-ignore
        position={position}
        // @ts-ignore
        scale={scale}
        {...bind()}
      >
        <planeBufferGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} />
      </animated.mesh>
      {modeChildren()}
    </Fragment>
  )
}

export default ThreeCanvasImage
