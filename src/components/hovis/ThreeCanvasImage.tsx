import { animated, to, useSpring } from "@react-spring/three"
import { useLoader, useThree } from "@react-three/fiber"
import { AnimatedCropImageMaterial } from "components/materials/CropImageMaterial"
import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
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

const AnimatedEdgeHandle = animated(ThreeEdgeHandle)

type Props = { item: CanvasImageItem } & CanvasProps

const ThreeCanvasImage = ({ item }: Props) => {
  const [{ mode, scale: canvasScale }, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { src, width, height } = item
  const texture = useLoader(THREE.TextureLoader, src)
  const { factor } = useThree((x) => x.viewport)

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

  const [{ inset }, setInset] = useSpring(() => ({
    inset: [0, 0, 0, 0],
  }))

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
        const op = () => async ({
          movement,
          event,
          down,
        }: FullGestureState<"drag">) => {
          event?.stopPropagation()
          // console.log(my, factor, canvasScale, height)
          const [mx, my] = pipe(
            movement,
            map((v) => v / item.scale / canvasScale),
            ([x, y]) => [x / item.width, y / item.height]
          )
          console.log(my)
          // here
        }
        return (
          <Fragment>
            <AnimatedEdgeHandle
              // position={[0, dy, 0]}
              // position-x={inset.to((x, y, z, w) => w - y)}
              position-x={0}
              position-y={inset.to((t) => dy - t)}
              // position-y={dy}
              position-z={0}
              {...(handleBind(op()) as any)}
            />
            <AnimatedEdgeHandle position={[dx, 0, 0]} />
            <AnimatedEdgeHandle position={[0, -dy, 0]} />
            <AnimatedEdgeHandle position={[-dx, 0, 0]} />
          </Fragment>
        )
      }
      default:
        return null
    }
  }

  return (
    <animated.mesh
      position-x={itemSpring.translate.to((x) => x)}
      position-y={itemSpring.translate.to((_x, y) => y)}
      position-z={1}
      scale-x={itemSpring.scale}
      scale-y={itemSpring.scale}
      scale-z={1}
      {...(itemBind() as any)}
    >
      <planeBufferGeometry args={[width, height]} />
      {/* <meshBasicMaterial map={texture} visible={mode !== "CROP"} /> */}
      <AnimatedCropImageMaterial
        uniforms-u_image-value={texture}
        uniforms-u_inset-value-x={inset.to((x) => x)}
        uniforms-u_inset-value-y={inset.to((_x, y) => y)}
        uniforms-u_inset-value-z={inset.to((_x, _y, z) => z)}
        uniforms-u_inset-value-w={inset.to((_x, _y, _z, w) => w)}
        visible={mode === "CROP"}
      />
      <group position-z={2}>{modeChildren()}</group>
    </animated.mesh>
  )
}

export default withSuspense(ThreeCanvasImage)
