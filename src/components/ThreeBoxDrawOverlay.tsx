import { a, to, useSpring } from "@react-spring/three"
import { OrbitControls } from "@react-three/drei"
import React, { Fragment, useRef } from "react"
import { Canvas, extend, useThree } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import { PlaneBufferGeometry } from "three"
extend({ OrbitControls })
import * as THREE from "three"

const { pow, sqrt } = Math
const sq = (v: number) => pow(v, 2)

const Plane = () => {
  const { viewport } = useThree()
  const ref = useRef<PlaneBufferGeometry>()
  const [{ scale }, set] = useSpring(() => ({
    scale: 0,
  }))

  const bind = useDrag(({ movement: [x, y], down }) => {
    if (!down) set({ reset: true, immediate: true })
    else {
      const foo = { scale: sqrt(sq(x) + sq(y)) / viewport.factor }
      console.log(foo)
      set(foo)
    }
  })

  return (
    <Fragment>
      <a.mesh {...bind()}>
        <a.planeBufferGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial color="orange" />
      </a.mesh>
      <a.mesh
      // scale={to(
      //   [scale],
      //   (scale) => [scale, scale, scale] as [number, number, number]
      // )}
      >
        <a.planeBufferGeometry ref={ref} args={[1, 1]} />
        <meshStandardMaterial color="steelblue" />
      </a.mesh>
    </Fragment>
  )
}

const ThreeBoxDrawOverlay = () => {
  return (
    <Canvas>
      <orthographicCamera />
      <ambientLight />
      <Plane />
      {/* <OrbitControls /> */}
    </Canvas>
  )
}

export default ThreeBoxDrawOverlay
