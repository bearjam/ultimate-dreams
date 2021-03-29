import Main from "components/Main"
import dynamic from "next/dynamic"
import React from "react"
import { Canvas } from "react-three-fiber"

const Test3 = () => {
  return (
    <div className="absolute w-full h-full bg-gray-200 touch-action-none">
      <Canvas orthographic>
        <Main />
      </Canvas>
    </div>
  )
}

// @ts-ignore
Test3.Layout = dynamic(() =>
  import("src/layouts").then((mod) => mod.NoopLayout)
)

export default Test3
