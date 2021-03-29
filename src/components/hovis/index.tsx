import React, { Fragment } from "react"
import AssetTools from "./AssetTools"
import CanvasContainer from "./CanvasContainer"
import ThreeCanvas from "./ThreeCanvas"
import TransformTools from "./TransformTools"

const HovisApp = () => {
  return (
    <Fragment>
      <CanvasContainer>
        {/* <DomCanvas /> */}
        <ThreeCanvas />
      </CanvasContainer>
      <AssetTools />
      <TransformTools />
    </Fragment>
  )
}

export default HovisApp
