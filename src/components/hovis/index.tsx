import React, { Fragment } from "react"
import AssetTools from "./AssetTools"
import CanvasCommon from "./CanvasCommon"
import TransformTools from "./TransformTools"

const HovisApp = () => {
  return (
    <Fragment>
      <CanvasCommon />
      <AssetTools />
      <TransformTools />
    </Fragment>
  )
}

export default HovisApp
