import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import React, { ReactNode } from "react"
import { useCanvasStore } from "stores/canvas"
import { Canvas as R3FCanvas } from "react-three-fiber"
import css from "./index.module.css"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

type Props = {
  children: ReactNode
}

const Canvas = ({ children }: Props) => {
  const { width, height, scale } = useCanvasStore(
    ({ state: { width, height, scale } }) => ({
      width,
      height,
      scale,
    })
  )

  return (
    <div className={css.threeCanvas} style={{ width, height }}>
      <R3FCanvas orthographic>{children}</R3FCanvas>
    </div>
  )
}

const ThreeCanvas = () => {
  const items = useCanvasStore((store) => store.state.items)
  const children = pipe(
    items,
    filterWithIndex((i) => i % 2 === 1),
    map((item) => {
      switch (item.type) {
        case "IMAGE":
          return <ThreeCanvasImage key={item.id} item={item} />
        case "TEXT":
          return <ThreeCanvasText key={item.id} item={item} />
        default:
          return null
      }
    })
  )
  return <Canvas>{children}</Canvas>
}

export default ThreeCanvas
