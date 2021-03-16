import React from "react"
import Canvas from "../../components/create/Canvas"
import AssetTools from "../../components/create/AssetTools"
import TransformTools from "../../components/create/TransformTools"

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
