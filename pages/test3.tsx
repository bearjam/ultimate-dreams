import React, { useRef, useState } from "react"
import { animated } from "react-spring"
import { useWheel } from "react-use-gesture"
import useMove from "src/hooks/useMove"

const Test3 = () => {
  const [{ top, left, scale }, setState] = useState({
    top: 50,
    left: 50,
    scale: 1,
  })

  const ref = useRef<HTMLHeadingElement | null>(null)

  const bind = useWheel(({ wheeling, vxvy: [_, y] }) => {
    if (!ref.current) return
    const next = scale + y / 10
    if (wheeling) {
      ref.current.style.transform = `scale(${next})`
    } else {
      setState((p) => ({ ...p, scale: next }))
      ref.current.style.transform = `scale(${scale})`
    }
  })

  return (
    <div>
      <animated.h2
        className="absolute w-64 h-64 bg-red-500 select-none"
        style={{ top, left, scale }}
        ref={ref}
        {...bind()}
      >
        hi
      </animated.h2>
    </div>
  )
}

export default Test3
