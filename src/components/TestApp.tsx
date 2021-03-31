import { to, useSpring } from "@react-spring/core"
import { animated } from "@react-spring/web"
import React from "react"
import { useDrag } from "react-use-gesture"

const TestApp = () => {
  const rootSpring = useSpring(() => ({
    translate: [0, 0],
  }))
  const [{ translate }, set] = rootSpring
  const bind = useDrag(({ movement: translate }) => {
    set({ translate })
  })
  return (
    <div className="bg-red-400" {...bind()}>
      <animated.div>{to([translate], ([x, y]) => `[${x},${y}]`)}</animated.div>
    </div>
  )
}

export default TestApp
