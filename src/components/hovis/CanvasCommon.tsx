import { useSpring } from "@react-spring/core"
import useMeasure from "react-use-measure"
import { useCanvasStore } from "stores/canvas"
import { FullSpring, Transforms2D } from "types/geometry"
import DomCanvas from "./DomCanvas"
import css from "./index.module.css"
import ThreeCanvas from "./ThreeCanvas"
import { Canvas as R3FCanvas } from "react-three-fiber"

export type CanvasProps = {
  canvasSpring: FullSpring<Transforms2D>
}

const CanvasCommon = () => {
  const state = useCanvasStore(({ state: { rotate, translate, scale } }) => ({
    rotate,
    translate,
    scale,
  }))
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
      <R3FCanvas orthographic gl={{ logarithmicDepthBuffer: true }}>
        <ThreeCanvas canvasSpring={canvasSpring} />
      </R3FCanvas>
    </div>
  )
}

export default CanvasCommon
