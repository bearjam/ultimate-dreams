import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import React, { Fragment, Suspense } from "react"
import { Canvas } from "react-three-fiber"
import { useCanvasStore } from "stores/canvas"
import ThreeCanvasImage from "./ThreeCanvasImage"

const Main = () => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { items } = state

  const children = pipe(
    items,
    map((item) => {
      switch (item.type) {
        case "IMAGE":
          console.log(item.src)
          return (
            <Suspense key={item.id} fallback={null}>
              <ThreeCanvasImage item={item} />
            </Suspense>
          )
        default:
          return null
      }
    })
  )

  return <Fragment>{children}</Fragment>
}

const ThreeCanvas = () => {
  return (
    <Canvas className="bg-yellow-300 touch-action-none">
      <Main />
    </Canvas>
  )
}

export default ThreeCanvas
