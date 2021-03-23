import { selectMode } from "lib/modes"
import React from "react"
import { animated } from "react-spring"
import { CanvasMode, CanvasTextItem } from "types/canvas"

type Props = {
  item: CanvasTextItem
}

const CanvasText = ({ item }: Props) => {
  const { text, top, left, width, height } = item
  return (
    <animated.div className="absolute" style={{ top, left, width, height }}>
      {text}
    </animated.div>
  )
}

export default CanvasText
