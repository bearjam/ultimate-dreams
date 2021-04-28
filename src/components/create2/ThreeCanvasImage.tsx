import { clamp, springConfig, withSuspense } from "lib/util"
import { CanvasImageItem, GestureHandlers } from "types/canvas"
import { animated, useSpring } from "@react-spring/three"
import { useCanvasStore } from "stores/canvas"
import { AnimatedCanvasImageMaterial } from "components/materials/CanvasImageMaterial"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { useDrag, useGesture } from "react-use-gesture"
import { pipe } from "fp-ts/function"
import { FullGestureState } from "react-use-gesture/dist/types"
import produce from "immer"
import { Fragment } from "react"
import EdgeHandle from "./EdgeHandle"

const clampScale = clamp(0.1, 10)

type Props = { item: CanvasImageItem }

const ThreeCanvasImage = ({ item }: Props) => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { width, height, src } = item
  const texture = useLoader(THREE.TextureLoader, src)

  const [{ rotate, translate, scale, inset }, spring] = useSpring(
    () => ({
      rotate: item.rotate,
      translate: item.translate,
      scale: item.scale,
      inset: [0, 0, 0, 0] as [number, number, number, number],
      config: springConfig,
    }),
    [item.rotate, item.translate, item.scale]
  )

  function itemGestureHandlers(): GestureHandlers {
    switch (state.mode) {
      case "SELECT":
        return {
          onDrag: async ({ down, movement: [dx, dy], event }) => {
            event.stopPropagation()
            const next = pipe(item.translate, ([x, y]) => [x + dx, y + dy]) as [
              number,
              number
            ]
            if (down) spring.start({ translate: next })
            else {
              await spring.start({ translate: next })
              dispatch({
                type: "UPDATE_ITEM",
                payload: {
                  itemId: item.id,
                  translate: next,
                },
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

  const itemBind = useGesture(itemGestureHandlers(), {
    transform: ([x, y]) => [x, -y],
  })

  const handleBind = useDrag(
    (state) =>
      // @ts-ignore
      void pipe(state, ...state.args),
    { transform: ([x, y]) => [x, -y] }
  )

  function modeChildren() {
    switch (state.mode) {
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
            <AnimatedVertexHandle
              position={[dx, dy, 1]}
              radius={itemSpring.scale.to((v) => 30 / v)}
              {...(handleBind(op(1, 1)) as any)}
            />
            <AnimatedVertexHandle
              position={[-dx, dy, 0]}
              radius={itemSpring.scale.to((v) => 30 / v)}
              {...(handleBind(op(-1, 1)) as any)}
            />
            <AnimatedVertexHandle
              position={[dx, -dy, 0]}
              radius={itemSpring.scale.to((v) => 30 / v)}
              {...(handleBind(op(1, -1)) as any)}
            />
            <AnimatedVertexHandle
              position={[-dx, -dy, 0]}
              radius={itemSpring.scale.to((v) => 30 / v)}
              {...(handleBind(op(-1, -1)) as any)}
            />
            {selected && (
              <AnimatedLine points={points} lineWidth={1} color="tomato" />
            )}
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
            // map((v) => v / item.scale / canvasScale),
            ([x, y]) => [x / item.width, y / item.height]
          )
          const s = ord < 2 ? -1 : 1
          const next = produce(inset.get(), (draft) => {
            draft[ord] = clamp(0, 1)(s * m[(ord + 1) % 2])
          })
          spring.start({ inset: next })
        }
        return (
          <Fragment>
            <EdgeHandle
              position-x={inset.to(
                (_t, r, _b, l) => (l * width - r * width) / 2
              )}
              position-y={inset.to((t) => height / 2 - height * t)}
              position-z={0}
              {...(handleBind(op(0)) as any)}
            />
            <EdgeHandle
              position-x={inset.to((t, r, b, l) => width / 2 - width * r)}
              position-y={inset.to(
                (t, _r, b, _l) => (b * item.height - t * item.height) / 2
              )}
              position-z={0}
              {...(handleBind(op(1)) as any)}
            />
            <EdgeHandle
              position-x={inset.to(
                (_t, r, _b, l) => (l * item.width - r * item.width) / 2
              )}
              position-y={inset.to(
                (_t, _r, b) => -(height / 2) + item.height * b
              )}
              position-z={0}
              {...(handleBind(op(2)) as any)}
            />
            <EdgeHandle
              position-x={inset.to((_t, _r, _b, l) => -(width / 2) + width * l)}
              position-y={inset.to(
                (t, _r, b, _l) => (b * item.height - t * item.height) / 2
              )}
              position-z={0}
              {...(handleBind(op(3)) as any)}
            />
          </Fragment>
        )
      }
    }
  }

  return (
    <animated.mesh
      position-x={translate.to((x) => x)}
      position-y={translate.to((_x, y) => y)}
      position-z={1}
      scale-x={scale}
      scale-y={scale}
      scale-z={1}
      {...(itemBind() as any)}
    >
      <planeBufferGeometry args={[width, height]} />
      <AnimatedCanvasImageMaterial
        uniforms-u_image-value={texture}
        uniforms-u_inset-value-x={inset.to((x) => x)}
        uniforms-u_inset-value-y={inset.to((_x, y) => y)}
        uniforms-u_inset-value-z={inset.to((_x, _y, z) => z)}
        uniforms-u_inset-value-w={inset.to((_x, _y, _z, w) => w)}
        uniforms-u_edge_color-value={[0.6, 0, 0.7, 1]}
      />
      {modeChildren()}
    </animated.mesh>
  )
}

export default withSuspense(ThreeCanvasImage)
