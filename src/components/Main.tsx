import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import React, { Fragment, Suspense } from "react"
import { useCanvasStore } from "stores/canvas"
import ThreeCanvasImage from "./create/ThreeCanvasImage"

const Main = () => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])

  const children = pipe(
    state.items,
    map((item) => {
      switch (item.type) {
        case "IMAGE":
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

export default Main
