import React, { forwardRef, Fragment, HTMLProps, useState } from "react"
import { useGesture } from "react-use-gesture"
import * as M from "rematrix"
import { NoopLayout } from "src/layouts"

const Box = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & { matrix: M.Matrix }
>(({ style, matrix, ...props }, ref) => (
  <div
    ref={ref}
    className="w-64 h-64 absolute bg-red-500"
    style={{ ...style, transform: M.toString(matrix) }}
    {...props}
  />
))

const MatrixCombos = () => {
  const [m0, setM0] = useState(M.identity())

  const getGestHandlers = useGesture({
    onWheel: ({ movement: [, y] }) => {
      setM0((p) => M.multiply(p, M.scale(1 + y / 1000)))
    },
    onDrag: ({ delta: [x, y] }) => {
      setM0((p) => M.multiply(M.translate(x, y), p))
    },
  })

  const someT = [15, 30] as const
  const zoom = 0.5

  const foo = M.multiply(M.translate(...someT), M.inverse(M.scale(zoom)))
  console.log(M.toString(foo))

  return (
    <Fragment>
      <Box matrix={m0} {...getGestHandlers()} />
    </Fragment>
  )
}

MatrixCombos.Layout = NoopLayout

export default MatrixCombos
