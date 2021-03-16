import React, { useState } from "react"
import { animated, useTransition } from "react-spring"

const SpringTransTest = () => {
  const [items, setItems] = useState(["this", "that", "the other"])
  const transition = useTransition(items, {
    from: {
      x: 0,
    },
    enter: {
      x: 500,
    },
    leave: {
      x: 0,
    },
  })
  const fragment = transition((style, item) => (
    <animated.div style={style as any}>{item}</animated.div>
  ))
  const killLastItem = () => void setItems((p) => p.slice(0, p.length - 1))
  return (
    <div>
      <div>{fragment}</div>
      <button onClick={killLastItem}>kill last item</button>
    </div>
  )
}

export default SpringTransTest
