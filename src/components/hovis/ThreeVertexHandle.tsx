import { animated } from "@react-spring/three"
import React from "react"
import { MeshProps } from "react-three-fiber"

type Props = MeshProps & {
  width?: number
  height?: number
}

const ThreeVertexHandle = ({ width = 50, height = 50, ...props }: Props) => {
  return (
    <mesh {...props}>
      <circleBufferGeometry args={[width, height]} />
      <meshBasicMaterial color="green" />
    </mesh>
  )
}

export default ThreeVertexHandle
