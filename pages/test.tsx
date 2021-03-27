import dynamic from "next/dynamic"
import React from "react"
import { NoopLayout } from "src/layouts"
import * as M from "rematrix"

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
          transform: M.toString(M.scale(0.5)),
        }}
      >
        <div
          className="bg-red-500 relative opacity-5"
          style={{
            transform: M.toString(M.scale(2)),
          }}
        >
          <ThreeSelector onSelect={console.log} />
        </div>
      </div>
    </div>
  )
}

Test.Layout = NoopLayout

export default Test
