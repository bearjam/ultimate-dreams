import React from "react"
import css from "./index.module.css"
import { Canvas as FiberCanvas } from "@react-three/fiber"
import CreateCanvas from "./CreateCanvas"
import TransformTools from "./TransformTools"

const Create2 = () => {
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
