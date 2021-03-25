import React, { useLayoutEffect, useMemo, useRef } from "react"
import { Canvas, useFrame } from "react-three-fiber"
import * as THREE from "three"
import { InstancedMesh } from "three"

const { sin, floor } = Math

const Dots = () => {
  const ref = useRef<InstancedMesh>()
  // useLayoutEffect(() => {
  //   const transform = new THREE.Matrix4()
  //   for (let i = 0; i < 10000; i++) {
  //     let x = (i % 100) - 50,
  //       y = Math.floor(i / 100) - 50
  //     transform.setPosition(x, y, 0)
  //     ref.current!.setMatrixAt(i, transform)
  //   }
  // }, [])

  const { vec, transform, positions } = useMemo(() => {
    const vec = new THREE.Vector3()
    const transform = new THREE.Matrix4()
    const positions = [...Array(10000)].map((_, i) => {
      const position = new THREE.Vector3()
      position.x = (i % 100) - 50
      position.y = floor(i / 100) - 50
      return position
    })
    return { vec, transform, positions }
  }, [])

  useFrame(({ clock }) => {
    const scale = 1 + sin(clock.elapsedTime) * 0.3
    for (let i = 0; i < 10000; i++) {
      vec.copy(positions[i]).multiplyScalar(scale)
      transform.setPosition(vec)
      ref.current!.setMatrixAt(i, transform)
    }
    ref.current!.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh
      ref={ref}
      // @ts-ignore
      args={[null, null, 10000]}
    >
      <circleBufferGeometry args={[0.15]} />
      <meshBasicMaterial />
    </instancedMesh>
  )
}

const ThreeCodrops = () => {
  return (
    <Canvas colorManagement={false} orthographic camera={{ zoom: 20 }}>
      <color
        attach="background"
        // @ts-ignore
        args={["black"]}
      />
      <Dots />
    </Canvas>
  )
}

export default ThreeCodrops
