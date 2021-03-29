import { to, useSpring } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { filterWithIndex, map } from "fp-ts/ReadonlyArray"
import { SCALE_QUOTIENT } from "lib/constants"
import React from "react"
import { Canvas as R3FCanvas } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import { clamp } from "../../lib/util"
import Camera from "./Camera"
import css from "./index.module.css"
import ThreeCanvasImage from "./ThreeCanvasImage"
import ThreeCanvasText from "./ThreeCanvasText"

const ThreeCanvas = () => {
  const [{ items, width, height, scale }, dispatch] = useCanvasStore(
    ({ state: { items, width, height, scale }, dispatch }) => [
      {
        items,
        width,
        height,
        scale,
      },
      dispatch,
    ]
  )

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

  const [{ my }, set] = useSpring(() => ({
    my: 0,
  }))

  const zoomClamp = clamp(0.1, 1.5)

  const zoomBind = useGesture({
    onWheel: async ({ wheeling, movement: [, my] }) => {
      await set({ my })
      if (!wheeling) {
        dispatch({
          type: "UPDATE_CANVAS",
          payload: {
            scale: clamp(0.1, 1.5)(scale - my / SCALE_QUOTIENT),
          },
        })
        set({ my: 0, immediate: true })
      }
    },
  })

  console.log(`hard: ${scale}`)

  const zoom = to([my], (my) => {
    const next = zoomClamp(scale - my / SCALE_QUOTIENT)
    console.log(`soft: ${next}`)
    return next
  })

  return (
    <div className={css.threeCanvas} style={{ width, height }}>
      <R3FCanvas orthographic {...zoomBind()}>
        <Camera zoom={zoom} />
        {children}
      </R3FCanvas>
    </div>
  )
}

export default ThreeCanvas
