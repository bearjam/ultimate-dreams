import { animated } from "@react-spring/three"
import React from "react"

const ThreeEdgeHandle = () => {
  return (
    <animated.mesh position-z={2}>
      <planeBufferGeometry args={[100, 100]} />
      <meshBasicMaterial color="green" />
    </animated.mesh>
  )
}

export default ThreeEdgeHandle
