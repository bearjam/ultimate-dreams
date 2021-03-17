import React from "react"
import Canvas from "../../src/components/create/Canvas"
import AssetTools from "../../src/components/create/AssetTools"
import TransformTools from "../../src/components/create/TransformTools"

const Create = () => {
  return (
    <div>
      <AssetTools />
      <Canvas />
      <TransformTools />
    </div>
  )
}

export default Create
