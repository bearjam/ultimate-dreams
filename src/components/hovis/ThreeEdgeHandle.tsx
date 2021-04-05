import React from "react"
import { MeshProps } from "react-three-fiber"

type Props = MeshProps & {
  width?: number
  height?: number
}

const ThreeEdgeHandle = ({ width = 100, height = 100, ...props }: Props) => {
  return (
    <mesh {...props}>
      <planeBufferGeometry args={[width, height]} />
      <meshBasicMaterial color="green" />
    </mesh>
  )
}

export default ThreeEdgeHandle
