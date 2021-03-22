import { useRef } from "react"
import { useSpring, update } from "react-spring"
import { useDrag } from "react-use-gesture"
import { CanvasMode } from "types/canvas"
import * as M from "rematrix"
import { useCanvasStore } from "stores/canvas"

const useMode = (mode: CanvasMode) => {
  const zoom = useCanvasStore((store) => store.state.zoom)
  const matrixRef = useRef(M.identity())
  switch (mode) {
    default:
      const ref = useRef<HTMLDivElement | null>(null)
      const gestures = useDrag(({ delta, event }) => {
        event.preventDefault()
        event.stopPropagation()
        const [x, y] = delta.map((x) => x * (1 / zoom))
        matrixRef.current = [M.translate(x, y), matrixRef.current].reduce(
          M.multiply
        )
        if (ref.current) {
          // ref.current.style.transformOrigin = "center center"
          ref.current.style.transform = M.toString(
            matrixRef.current
            // M.multiply(M.translate(x, y), M.inverse(M.scale(zoom)))
          )
        }
      })
      return { ...gestures(), ref }
  }
}

export default useMode
