import React, { useEffect } from "react"
import css from "./index.module.css"
import { Canvas as FiberCanvas } from "@react-three/fiber"
import CreateCanvas from "./CreateCanvas"
import TransformTools from "./TransformTools"
import { useCanvasStore } from "stores/canvas"

const Create2 = () => {
  const selectedItems = useCanvasStore((store) => store.state.selectedItems)
  useEffect(() => void console.log(selectedItems), [selectedItems])
  return (
    <div className={css.canvasContainer}>
      <FiberCanvas orthographic>
        <CreateCanvas />
      </FiberCanvas>
      <TransformTools />
    </div>
  )
}

export default Create2
