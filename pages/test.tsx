import React, { useState } from "react"
import dynamic from "next/dynamic"
import { NoopLayout } from "src/layouts"
import useMeasure from "react-use-measure"
import { useDrag } from "react-use-gesture"
import { useSpring } from "@react-spring/core"
const ThreeBasics = dynamic(() => import("components/ThreeBasics"), {
  ssr: false,
})

const Test = () => {
  const [springVals, set] = useSpring(() => ({
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
  }))
  const bind = useDrag(({ down, initial: [x0, y0], xy: [x1, y1] }) => {
    if (!down) set({ reset: true, immediate: true })
    else set({ x0, y0, x1, y1 })
  })
  return (
    <div className="absolute w-full h-full bg-indigo-300">
      <div className="absolute inset-0 m-auto w-64 h-64 bg-red-300">
        <ThreeBasics />
      </div>
    </div>
  )
}

Test.Layout = NoopLayout

export default Test
