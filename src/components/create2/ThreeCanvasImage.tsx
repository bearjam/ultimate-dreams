import { springConfig, withSuspense } from "lib/util"
import { CanvasImageItem, GestureHandlers } from "types/canvas"
import { animated, useSpring } from "@react-spring/three"
import { useCanvasStore } from "stores/canvas"
import { AnimatedCanvasImageMaterial } from "components/materials/CanvasImageMaterial"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { useGesture } from "react-use-gesture"
import { pipe } from "fp-ts/function"

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

  function gestureHandlers(): GestureHandlers {
    switch (state.mode) {
      case "MOVE":
      default:
        return {
          onDrag: async ({ down, movement: [dx, dy], event }) => {
            event.stopPropagation()
            // const [dx, dy] = movement.map((v) => v / canvasScale)
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
          // onWheel: () => {},
        }
      case "SCALE":
        return {
          onDrag: () => {},
          // onWheel: async ({ wheeling, movement, event }) => {
          //   event.stopPropagation()
          //   const wheelY = movement[1] / canvasScale
          //   const next = clampScale(item.scale + wheelY / SCALE_QUOTIENT)
          //   if (wheeling) {
          //     itemSpringApi.set({ scale: next })
          //   } else {
          //     await itemSpringApi.set({ scale: next })
          //     dispatch({
          //       type: "UPDATE_ITEM",
          //       payload: {
          //         itemId: item.id,
          //         scale: next,
          //       },
          //     })
          //   }
          // },
        }
      // default:
      //   return {
      //     onDrag: () => {},
      //     // onWheel: () => {},
      //   }
    }
  }

  const bind = useGesture(gestureHandlers(), {
    transform: ([x, y]) => [x, -y],
  })

  return (
    <animated.mesh
      position-x={translate.to((x) => x)}
      position-y={translate.to((_x, y) => y)}
      position-z={1}
      scale-x={scale}
      scale-y={scale}
      scale-z={1}
      {...(bind() as any)}
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
    </animated.mesh>
  )
}

export default withSuspense(ThreeCanvasImage)
