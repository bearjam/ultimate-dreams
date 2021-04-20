import { animated, to, useSpring } from "@react-spring/three"
import { useLoader } from "@react-three/fiber"
import { AnimatedCropImageMaterial } from "components/materials/CropImageMaterial"
import { pipe } from "fp-ts/function"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp, springConfig, withSuspense } from "lib/util"
import React, { Fragment } from "react"
import { useDrag, useGesture } from "react-use-gesture"
import { FullGestureState } from "react-use-gesture/dist/types"
import { useCanvasStore } from "stores/canvas"
import * as THREE from "three"
import { CanvasImageItem, GestureHandlers } from "types/canvas"
import { Vector2 } from "types/geometry"
import { CanvasProps } from "./CanvasCommon"
import ThreeEdgeHandle from "./ThreeEdgeHandle"
import ThreeVertexHandle from "./ThreeVertexHandle"

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

  const itemBind = useGesture(getHandlers(), {
    transform: ([x, y]) => [x, -y],
  })

  const handleBind = useDrag(
    (state) =>
      // @ts-ignore
      void pipe(state, ...state.args),
    { transform: ([x, y]) => [x, -y] }
  )

  function modeChildren() {
    const [dx, dy] = [width / 2, height / 2]
    switch (mode) {
      case "SCALE": {
        const op = (xmult: number, ymult: number) => async ({
          movement: [mx, my],
          event,
          down,
        }: FullGestureState<"drag">) => {
          event?.stopPropagation()
          const next = clampScale(
            scale +
              (xmult * mx + ymult * my) /
                2 /
                ((width + height) / 2) /
                canvasScale
          )
          if (down) {
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
        }

        return (
          <Fragment>
            <ThreeVertexHandle
              position={[dx, dy, 0]}
              {...(handleBind(op(1, 1)) as any)}
            />
            <ThreeVertexHandle
              position={[-dx, dy, 0]}
              {...(handleBind(op(-1, 1)) as any)}
            />
            <ThreeVertexHandle
              position={[dx, -dy, 0]}
              {...(handleBind(op(1, -1)) as any)}
            />
            <ThreeVertexHandle
              position={[-dx, -dy, 0]}
              {...(handleBind(op(-1, -1)) as any)}
            />
          </Fragment>
        )
      }
      case "CROP": {
        return (
          <Fragment>
            <ThreeEdgeHandle position={[0, dy, 0]} />
            <ThreeEdgeHandle position={[dx, 0, 0]} />
            <ThreeEdgeHandle position={[0, -dy, 0]} />
            <ThreeEdgeHandle position={[-dx, 0, 0]} />
          </Fragment>
        )
      }
      default:
        return null
    }
  }

  return (
    <animated.mesh
      position={to([itemSpring.translate], ([x0, y0]) => [x0, y0, 1]) as any}
      scale={to([itemSpring.scale], (s0) => [s0, s0, 1]) as any}
      {...(itemBind() as any)}
    >
      <planeBufferGeometry args={[width, height]} />
      <meshBasicMaterial
        // attachArray="material"
        map={texture}
        visible={mode !== "CROP"}
      />
      <AnimatedCropImageMaterial
        uniforms-u_image-value={texture}
        uniforms-u_inset-value={new THREE.Vector4(0.0, 0.0, 0.0, 0.0)}
        visible={mode === "CROP"}
      />
      <group position-z={2}>{modeChildren()}</group>
    </animated.mesh>
  )
}

export default withSuspense(ThreeCanvasImage)
