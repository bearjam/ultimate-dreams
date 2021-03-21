import React, { useState } from "react"
import { animated } from "react-spring"
import useMove from "src/hooks/useMove"

const Test2 = () => {
  const [{ top, left }, setState] = useState({
    top: 50,
    left: 50,
  })
  const [style, bind] = useMove({
    update: ([x, y]) => setState((p) => ({ left: p.left + x, top: p.top + y })),
  })

  return (
    <div>
      <animated.h2
        className="absolute w-64 h-64 bg-red-500 select-none"
        style={{ top, left, ...style }}
        {...bind()}
      >
        hi
      </animated.h2>
    </div>
  )
}

export default Test2
