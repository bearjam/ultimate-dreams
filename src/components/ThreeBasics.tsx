import { OrbitControls } from "@react-three/drei"
import React, { Fragment, useMemo, useState } from "react"
import { Canvas, extend, useThree } from "react-three-fiber"
import * as THREE from "three"
extend({ OrbitControls })

const Plane = () => {
  const { viewport } = useThree()
  console.log(viewport.width, viewport.height, 1)

  const geom = useMemo(
    () => new THREE.PlaneBufferGeometry(viewport.width, viewport.height),
    []
  )

  return (
    <Fragment>
      <mesh>
        <primitive object={geom} attach="geometry" />
        <planeBufferGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial color="steelblue" />
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
