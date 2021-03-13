// import { useAtom } from "jotai"
import React from "react"
import Canvas from "./Canvas"
import ExploreTools from "./ExploreTools"
import TransformTools from "./TransformTools"

const Create = () => {
  return (
    <div>
      <ExploreTools />
      <Canvas />
      <TransformTools />
    </div>
  )
}

export default Create
