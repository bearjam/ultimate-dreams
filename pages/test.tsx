import dynamic from "next/dynamic"
import React from "react"
import { NoopLayout } from "src/layouts"

const ThreeFooAgain = dynamic(() => import("components/ThreeFooAgain"), {
  ssr: false,
})

const Test = () => {
  return (
    <div className="absolute w-full h-full bg-indigo-300">
      <ThreeFooAgain />
    </div>
  )
}

Test.Layout = NoopLayout

export default Test
