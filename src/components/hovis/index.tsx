import React, { Fragment } from "react"
import { useCanvasStore } from "stores/canvas"
import AssetTools from "./AssetTools"
import CanvasContainer from "./CanvasContainer"
import DomCanvas from "./DomCanvas"
import ThreeCanvas from "./ThreeCanvas"
import TransformTools from "./TransformTools"

const HovisApp = () => {
  const state = useCanvasStore((store) => store.state)
  console.log(state)
  return (
    <Fragment>
      <CanvasContainer>
        <DomCanvas />
        {/* <ThreeCanvas /> */}
      </CanvasContainer>
      <AssetTools />
      <TransformTools />
    </Fragment>
  )
}

export default HovisApp
