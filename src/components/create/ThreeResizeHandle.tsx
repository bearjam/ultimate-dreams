import { animated, Interpolation, to } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import React from "react"
import { CanvasItemT } from "types/canvas"

type Props = {
  position: Interpolation<number[], any>
  scale: Interpolation<number[], any>
  item: CanvasItemT
  ord: number
}

const ThreeResizeHandle = ({ item, ord, position, scale }: Props) => {
  const xSign = ord % 2 === 0 ? (v: number) => v : (v: number) => -v
  const ySign = ord < 2 ? (v: number) => v : (v: number) => -v

  return (
    <animated.mesh
      // @ts-ignore
      position={to(
        [position, scale],
        ([tx, ty], [scale]) =>
          [
            ...pipe(
              [tx + xSign(item.width / 2), ty + ySign(item.height / 2)],
              map((v) => v * scale)
            ),
            1,
          ] as [number, number, number]
      )}
      // @ts-ignore
      scale={to([scale], ([scale]) => [scale, scale, 1])}
    >
      <circleBufferGeometry args={[0.1, 8]} />
      <meshBasicMaterial color="tomato" />
    </animated.mesh>
  )
}

export default ThreeResizeHandle
