import { useSpring } from "@react-spring/core"
import useMeasure from "react-use-measure"
import { useCanvasStore } from "stores/canvas"
import { FullSpring, Transforms2D } from "types/geometry"
import DomCanvas from "./DomCanvas"
import css from "./index.module.css"
import ThreeCanvas from "./ThreeCanvas"

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
      <ThreeCanvas canvasSpring={canvasSpring} />
    </div>
  )
}

export default CanvasCommon
