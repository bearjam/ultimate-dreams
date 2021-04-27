import { useSpring } from "@react-spring/core"
import useMeasure from "react-use-measure"
import { useCanvasStore } from "stores/canvas"
import { FullSpring, Transforms2D } from "types/geometry"
import DomCanvas from "./DomCanvas"
import css from "./index.module.css"
import ThreeCanvas from "./ThreeCanvas"
import { Canvas as R3FCanvas } from "@react-three/fiber"
import { useEffect } from "react"

export type CanvasProps = {
  canvasSpring: FullSpring<Transforms2D>
}

const CanvasCommon = () => {
  const state = useCanvasStore(
    ({ state: { rotate, translate, scale, selectedItems } }) => ({
      rotate,
      translate,
      scale,
      selectedItems,
    })
  )
  useEffect(() => {
    // del me
    console.log(state.selectedItems)
  }, [state.selectedItems])
  const canvasSpring = useSpring<Transforms2D>(
    () => ({
      ...state,
    }),
    [state]
  )

  // const [ref, bounds] = useMeasure()

  return (
    <div className={css.canvasContainer}>
      {/* <DomCanvas canvasSpring={canvasSpring} containerBounds={bounds} /> */}
      <R3FCanvas orthographic>
        <ThreeCanvas canvasSpring={canvasSpring} />
      </R3FCanvas>
    </div>
  )
}

export default CanvasCommon
