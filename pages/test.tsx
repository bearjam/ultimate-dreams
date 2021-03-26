import dynamic from "next/dynamic"
import React from "react"
import { NoopLayout } from "src/layouts"

const ThreeSelector = dynamic(() => import("components/ThreeSelector"), {
  ssr: false,
})

const Test = () => {
  return (
    <div className="absolute w-full h-full bg-indigo-300">
      <div
        className="absolute bg-yellow-400 inset-0 m-auto"
        style={{
          width: "48rem",
          height: "48rem",
        }}
      >
        <ThreeSelector onSelect={console.log} />
      </div>
    </div>
  )
}

Test.Layout = NoopLayout

export default Test
