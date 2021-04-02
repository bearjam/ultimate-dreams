import { pipe } from "fp-ts/function"
import { replicate } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp, springConfig, withSuspense } from "lib/util"
import React, { Fragment, Suspense } from "react"
import { to, animated, useSpring } from "react-spring/three"
import { useLoader, useThree } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import * as THREE from "three"
import { CanvasImageItem, GestureHandlers } from "types/canvas"
import { Transforms2D, Vector2 } from "types/geometry"
import { CanvasProps } from "./CanvasCommon"

type Props = { item: CanvasImageItem } & CanvasProps

const ThreeCanvasImage = ({ item }: Props) => {
  const [{ mode, scale: canvasScale }, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { src, width, height } = item
  const texture = useLoader(THREE.TextureLoader, src)

  const { rotate, translate, scale } = item

  const [itemSpring, setItemSpring] = useSpring(
    () => ({
      rotate,
      translate,
      scale,
      config: springConfig,
    }),
    [rotate, translate, scale]
  )

  const clampScale = clamp(0.1, 1.5)

  function getHandlers(): GestureHandlers {
    switch (mode) {
      case "MOVE":
        return {
          onDrag: async ({ down, movement, event }) => {
            event.stopPropagation()
            const [dx, dy] = movement.map((v) => v / canvasScale)
            const next = pipe(
              translate,
              ([x, y]) => [x + dx, y + dy] as Vector2
            )
            if (down) setItemSpring({ translate: next })
            else {
              await setItemSpring({ translate: next })
              dispatch({
                type: "UPDATE_ITEM",
                payload: {
                  itemId: item.id,
                  translate: next,
                },
              })
            }
          },
          onWheel: () => {},
        }
      case "SCALE":
        return {
          onDrag: () => {},
          onWheel: async ({ wheeling, movement, event }) => {
            event.stopPropagation()
            const wheelY = movement[1] / canvasScale
            const next = clampScale(item.scale + wheelY / SCALE_QUOTIENT)
            if (wheeling) {
              setItemSpring({ scale: next })
            } else {
              await setItemSpring({ scale: next })
              dispatch({
                type: "UPDATE_ITEM",
                payload: {
                  itemId: item.id,
                  scale: next,
                },
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

  const bind = useGesture(getHandlers(), {
    transform: ([x, y]) => [x, -y],
  })

  function modeChildren() {
    // switch (mode) {
    //   case "SCALE":
    //     return [...Array(4)].map((_, i) => (
    //       <ThreeResizeHandle
    //         key={i}
    //         item={item}
    //         ord={i}
    //         position={position}
    //         scale={scale}
    //       />
    //     ))
    // }
  }

  return (
    <Fragment>
      <animated.mesh
        position={to([itemSpring.translate], ([x0, y0]) => [x0, y0, 1]) as any}
        scale={to([itemSpring.scale], (s0) => replicate(s0)(3)) as any}
        {...bind()}
      >
        <planeBufferGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} />
      </animated.mesh>
      {modeChildren()}
    </Fragment>
  )
}

export default withSuspense(ThreeCanvasImage)
