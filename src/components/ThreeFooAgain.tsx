import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import React, { useLayoutEffect, useRef } from "react"
import { Canvas, useThree } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import { Mesh } from "three"

const Plane = () => {
  const {
    viewport: { width, height, factor },
  } = useThree()

  const ref = useRef<Mesh>()

  const scale = (x: number, y: number) => {
    ref.current!.scale.x = x
    ref.current!.scale.y = y
  }

  const position = (x: number, y: number) => {
    ref.current!.position.x = x
    ref.current!.position.y = y
  }

  useLayoutEffect(() => void scale(0, 0), [])

  const bind = useDrag(({ initial, xy }) => {
    const pipeline = (xy: [number, number]) =>
      pipe(
        xy,
        map((v) => v / factor),
        ([x, y]) => [x - width / 2, -y + height / 2]
      )

    const [x0, y0] = pipe(initial, pipeline)
    const [x1, y1] = pipe(xy, pipeline)

    scale(x1 - x0, y1 - y0)
    position(x0 + (x1 - x0) / 2, y0 + (y1 - y0) / 2)
  })

  return (
    <group {...bind()}>
      <mesh>
        <planeBufferGeometry args={[width, height]} />
        <meshBasicMaterial color="indigo" />
      </mesh>
      <mesh ref={ref}>
        <planeBufferGeometry args={[1, 1]} />
        <meshBasicMaterial color="pink" />
      </mesh>
    </group>
  )
}

const ThreeFooAgain = () => {
  return (
    <Canvas>
      <Plane />
    </Canvas>
  )
}

export default ThreeFooAgain
