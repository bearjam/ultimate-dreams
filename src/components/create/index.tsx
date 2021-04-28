import { Canvas as FiberCanvas } from "@react-three/fiber"
import React, { useEffect } from "react"
import { useCanvasStore } from "stores/canvas"
import AssetTools from "./AssetTools"
import CreateCanvas from "./CreateCanvas"
import css from "./index.module.css"
import TransformTools from "./TransformTools"

const Create2 = () => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  useEffect(() => {
    dispatch({
      type: "CLEAR_CROP_INSET",
    })
  }, [state.selectedItems])
  useEffect(() => {
    console.log(`state.items.length: ${state.items.length}`)
  }, [state.items])
  return (
    <div className={css.canvasContainer}>
      <FiberCanvas orthographic>
        <CreateCanvas />
      </FiberCanvas>
      <TransformTools />
      <AssetTools />
    </div>
  )
}

export default Create2
