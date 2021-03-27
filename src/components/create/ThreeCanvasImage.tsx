import { springConfig } from "lib/util"
import React, { useRef } from "react"
import { animated, to, useSpring } from "react-spring/three"
import { useLoader, useThree } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { FullGestureState } from "react-use-gesture/dist/types"
import { useCanvasStore } from "stores/canvas"
import * as THREE from "three"
import { Mesh } from "three"
import { CanvasImageItem, GestureHandlers } from "types/canvas"

type Props = { item: CanvasImageItem }

const ThreeCanvasImage = ({ item }: Props) => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { mode } = state

  const ref = useRef<Mesh>()

  const {
    viewport: { factor },
  } = useThree()

  const { src, width, height, translate, scale } = item

  const texture = useLoader(THREE.TextureLoader, src)

  const [{ x, y, z }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
    config: springConfig,
  }))

  const handlerZ = async ({
    wheeling,
    pinching,
    movement: [_, z],
    event,
  }: FullGestureState<"pinch" | "wheel">) => {
    event?.stopPropagation()
    const { finished } = await set({ z: z / 10 })
    console.log("am i pinch/wheel?")
    if (!(wheeling || pinching)) {
      dispatch({
        type: "SCALE_ITEM",
        payload: {
          itemId: item.id,
          scaleDelta: z / 10,
        },
      })
      set({ z: 0, immediate: true })
    }
  }

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
          onPinch: () => {},
        }
      case "SCALE":
        return {
          onDrag: () => {},
          onWheel: handlerZ,
          onPinch: handlerZ,
        }
      default:
        return {
          onDrag: () => {},
          onWheel: () => {},
          onPinch: () => {},
        }
    }
  }

  const bind = useGesture(getHandlers(), {
    transform: ([x, y]) => [x / factor, -y / factor],
  })

  return (
    <animated.mesh
      ref={ref}
      // @ts-ignore
      position={to([x, y], (x, y) => [translate.x + x, translate.y + y, 0])}
      // @ts-ignore
      scale={to([z], (z) => [item.scale + z, item.scale + z, 1])}
      {...bind()}
    >
      <planeBufferGeometry args={[width / factor, height / factor]} />
      <meshBasicMaterial map={texture} />
    </animated.mesh>
  )
}

export default ThreeCanvasImage
