import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import { Fragment } from "react"
import { useCanvasStore } from "stores/canvas"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

const ThreeCanvas = () => {
  const items = useCanvasStore((store) => store.state.items)
  const children = pipe(
    items,
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
  return <Fragment>{children}</Fragment>
}

export default ThreeCanvas
