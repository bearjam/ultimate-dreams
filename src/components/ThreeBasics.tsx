import { to } from "@react-spring/core"
import { OrbitControls } from "@react-three/drei"
import React, { Fragment, useMemo, useState } from "react"
import { Canvas, extend, useFrame, useThree } from "react-three-fiber"
import * as THREE from "three"
extend({ OrbitControls })

const Plane = () => {
  const { viewport } = useThree()
  console.log(viewport.width, viewport.height, 1)

  const geom = useMemo(
    () => new THREE.PlaneBufferGeometry(viewport.width, viewport.height),
    []
  )

  useFrame(() => {})

  // const geom = to([x0,y0,x1,y1], (x0,y0,x1,y1) => new THREE.PlaneBufferGeometry(x1 - x0, y1 - y0))
  return (
    <Fragment>
      <mesh>
        <primitive object={geom} attach="geometry" />
        <meshStandardMaterial color="orange" />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[geom]} />
        <lineBasicMaterial color="red" attach="material" />
      </lineSegments>
    </Fragment>
  )
}

const ThreeBasics = () => {
  return (
    <Canvas>
      <orthographicCamera />
      <ambientLight />
      <Plane />
      <OrbitControls />
    </Canvas>
  )
}

export default ThreeBasics
