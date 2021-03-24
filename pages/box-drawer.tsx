import { to, useSpring } from "@react-spring/core"
import { springConfig } from "lib/util"
import React, { PropsWithChildren } from "react"
import { animated } from "react-spring"
import { useDrag } from "react-use-gesture"
import * as M from "rematrix"
import { NoopLayout } from "src/layouts"

const { abs } = Math

const Parent = ({ children }: PropsWithChildren<{}>) => {
  const [{ x0, y0, x1, y1 }, set] = useSpring(() => ({
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    config: springConfig,
  }))
  const bind = useDrag(({ initial: [x0, y0], xy: [x1, y1] }) => {
    set({
      x0,
      y0,
      x1,
      y1,
    })
  })
  return (
    <div className="absolute w-full h-full bg-gray-400" {...bind()}>
      {children}
      <div className="relative border-8 border-black">
        <animated.div
          className="absolute bg-pink-500 top-0 left-0 opacity-30 "
          style={{
            width: 1,
            height: 1,
            scaleX: to([x0, x1], (x0, x1) => x1 - x0),
            scaleY: to([y0, y1], (y0, y1) => y1 - y0),
            x: to([x0, x1], (x0, x1) => x0 + (x1 - x0) / 2),
            y: to([y0, y1], (y0, y1) => y0 + (y1 - y0) / 2),
          }}
        />
      </div>
    </div>
  )
}
const BoxDrawer = () => {
  return <Parent />
}

BoxDrawer.Layout = NoopLayout
export default BoxDrawer
