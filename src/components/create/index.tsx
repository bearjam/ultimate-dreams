import React, { Fragment } from "react"
import Canvas from "./Canvas"
import AssetTools from "./AssetTools"
import TransformTools from "./TransformTools"

const Create = () => {
  return (
    <Fragment>
      <AssetTools />
      <Canvas />
      <TransformTools />
    </Fragment>
  )
}

export default Create
