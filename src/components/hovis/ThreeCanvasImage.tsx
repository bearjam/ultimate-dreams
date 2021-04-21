import { animated, useSpring } from "@react-spring/three"
import { Text } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { AnimatedCropImageMaterial } from "components/materials/CropImageMaterial"
import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import produce from "immer"
import { SCALE_QUOTIENT } from "lib/constants"
import { clamp, springConfig, withSuspense } from "lib/util"
import React, { Fragment, useEffect, useRef } from "react"
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
  const htmlImage = useRef(new Image())
  useEffect(() => {
    // htmlImage.current = new Image() ??
    htmlImage.current.crossOrigin = "anonymous"
    htmlImage.current.src = item.src
  }, [item.src])

  const [{ mode, scale: canvasScale }, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { src, width, height } = item
  console.log(width, height)
  const texture = useLoader(THREE.TextureLoader, src)

  const { rotate, translate, scale } = item

  const [itemSpring, itemSpringApi] = useSpring(
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
            console.log(next)
            if (down) itemSpringApi.start({ translate: next })
            else {
              await itemSpringApi.start({ translate: next })
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
              itemSpringApi.set({ scale: next })
            } else {
              await itemSpringApi.set({ scale: next })
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

  const [{ inset }, insetSpringApi] = useSpring(() => ({
    inset: [0, 0, 0, 0] as [number, number, number, number],
  }))

  const executeCrop = () => {
    if (!htmlImage.current.complete) return
    dispatch({
      type: "CROP_IMAGE",
      payload: {
        itemId: item.id,
        inset: inset.get(),
        htmlImage: htmlImage.current,
      },
    })
    insetSpringApi.start({ inset: [0, 0, 0, 0], immediate: true })
  }

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
            itemSpringApi.set({ scale: next })
          } else {
            await itemSpringApi.set({ scale: next })
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
        const op = (ord: number) => async ({
          movement,
          event,
          down,
        }: FullGestureState<"drag">) => {
          event?.stopPropagation()
          const m = pipe(
            movement,
            map((v) => v / item.scale / canvasScale),
            ([x, y]) => [x / item.width, y / item.height]
          )
          const s = ord < 2 ? -1 : 1
          const next = produce(inset.get(), (draft) => {
            draft[ord] = clamp(0, 1)(s * m[(ord + 1) % 2])
          })
          insetSpringApi.start({ inset: next })
        }
        return (
          <Fragment>
            <AnimatedEdgeHandle
              position-x={inset.to(
                (_t, r, _b, l) => (l * item.width - r * item.width) / 2
              )}
              position-y={inset.to((t) => dy - item.height * t)}
              position-z={0}
              {...(handleBind(op(0)) as any)}
            />
            <AnimatedEdgeHandle
              position-x={inset.to((t, r, b, l) => dx - item.width * r)}
              position-y={inset.to(
                (t, _r, b, _l) => (b * item.height - t * item.height) / 2
              )}
              position-z={0}
              {...(handleBind(op(1)) as any)}
            />
            <AnimatedEdgeHandle
              position-x={inset.to(
                (_t, r, _b, l) => (l * item.width - r * item.width) / 2
              )}
              position-y={inset.to((_t, _r, b) => -dy + item.height * b)}
              position-z={0}
              {...(handleBind(op(2)) as any)}
            />
            <AnimatedEdgeHandle
              position-x={inset.to((_t, _r, _b, l) => -dx + item.width * l)}
              position-y={inset.to(
                (t, _r, b, _l) => (b * item.height - t * item.height) / 2
              )}
              position-z={0}
              {...(handleBind(op(3)) as any)}
            />
            <Text
              color="black"
              fontSize={100}
              position-x={dx + 100}
              position-y={dy + 100}
              onClick={executeCrop}
            >
              CROP!
            </Text>
            {/* <mesh position-x={dx }>
              <planeBufferGeometry args={[100, 100]} />
              <meshBasicMaterial color="tomato" />
            </mesh> */}
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
