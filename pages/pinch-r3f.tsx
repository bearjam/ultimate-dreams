import dynamic from "next/dynamic"
import React from "react"
import { Canvas } from "react-three-fiber"
import { usePinch } from "react-use-gesture"
import { NoopLayout } from "src/layouts"
import theme from "tailwindcss/defaultTheme"

const BasicDOMPinch = () => {
  const bind = usePinch(({ pinching, movement: [, y] }) => {
    console.log(y)
  })
  return (
    <div className="bg-red-500 w-64 h-64 touch-action-none" {...bind()}>
      <h2>hi</h2>
    </div>
  )
}

const CanvasMain = () => {
  const bind = usePinch(({ pinching, movement: [, y] }) => {
    console.log(y)
  })
  return (
    <mesh {...bind()}>
      <boxBufferGeometry />
      <meshBasicMaterial color={theme.colors.red[500]} />
    </mesh>
  )
}

const PinchR3F = () => {
  return (
    <div className="absolute w-full h-full bg-gray-200 touch-action-none">
      <Canvas>
        <CanvasMain />
      </Canvas>
    </div>
  )
}

// @ts-ignore
PinchR3F.Layout = dynamic(() =>
  import("src/layouts").then((mod) => mod.NoopLayout)
)

export default PinchR3F
