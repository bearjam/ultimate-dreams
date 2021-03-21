import { Ord } from "fp-ts/number"
import { clamp } from "fp-ts/Ord"
import React, { Fragment, useRef, useState } from "react"
import { useGesture } from "react-use-gesture"

const TestPage = () => {
  const [scale, setScale] = useState(1)
  const ref = useRef<HTMLDivElement | null>(null)
  const dx = useRef(0)

  const pipeline = ([acting, px]: [boolean, number]) => {
    const clam = clamp(Ord)(0.1, 1.5)
    if (acting) {
      dx.current += px
    } else {
      setScale((p) => clam(p + dx.current / 2000))
      dx.current = 0
    }
    if (ref.current) {
      ref.current.style.transform = `scale(${clam(scale + dx.current / 1000)})`
    }
  }

  const bind = useGesture({
    onWheel: ({ wheeling, movement: [_, y] }) => {
      pipeline([wheeling, y])
    },
    onPinch: ({ pinching, movement: [_, y], event }) => {
      event.preventDefault()
      pipeline([pinching, y])
    },
    onScroll: ({ scrolling, movement: [_, y] }) => {
      pipeline([scrolling, y])
    },
  })

  return (
    <Fragment>
      <div
        className="w-64 h-64 bg-red-500 touch-action-none"
        {...bind()}
        ref={ref}
      />
    </Fragment>
  )
}

export default TestPage
