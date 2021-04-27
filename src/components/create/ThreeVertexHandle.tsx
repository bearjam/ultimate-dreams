import { MeshProps } from "@react-three/fiber"
import React from "react"

type Props = MeshProps & {
  radius?: number
  segments?: number
}

const ThreeVertexHandle = ({ radius = 50, segments = 64, ...props }: Props) => {
  return (
    <mesh {...props}>
      <circleBufferGeometry args={[radius, segments]} />
      <meshBasicMaterial color="green" />
    </mesh>
  )
}

export default ThreeVertexHandle
