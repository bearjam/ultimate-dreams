import { animated } from "@react-spring/three"
import React, { useLayoutEffect } from "react"
import { useThree } from "react-three-fiber"

type Props = {
  zoom: number
}
const Camera = ({ zoom }: Props) => {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.zoom = zoom
    camera.updateProjectionMatrix()
  }, [zoom])

  return <></>
}

export default animated(Camera)
