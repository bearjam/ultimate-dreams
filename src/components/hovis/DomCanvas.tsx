import { pipe } from "fp-ts/function"
import { filter, filterWithIndex, map } from "fp-ts/ReadonlyArray"
import React, { ReactNode } from "react"
import { useCanvasStore } from "stores/canvas"
import DomCanvasImage from "./DomCanvasImage"
import DomCanvasText from "./DomCanvasText"
import css from "./index.module.css"

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
    <div className={css.domCanvas} style={{ width, height }}>
      {children}
    </div>
  )
}

const DomCanvas = () => {
  const items = useCanvasStore((store) => store.state.items)
  const children = pipe(
    items,
    filterWithIndex((i) => i % 2 === 0),
    map((item) => {
      switch (item.type) {
        case "IMAGE":
          return <DomCanvasImage key={item.id} item={item} />
        case "TEXT":
          return <DomCanvasText key={item.id} item={item} />
        default:
          return null
      }
    })
  )
  return <Canvas>{children}</Canvas>
}

export default DomCanvas
