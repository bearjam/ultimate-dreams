import { selectMode } from "lib/modes"
import React from "react"
import { animated } from "react-spring"
import { CanvasMode, CanvasTextItem } from "types/canvas"

const useMode = (item: CanvasTextItem, mode: CanvasMode) => {
  switch (mode) {
    default:
      return selectMode(item)
  }
}

type Props = {
  item: CanvasTextItem
  mode: CanvasMode
}

const CanvasText = ({ item, mode }: Props) => {
  const { text, top, left, width, height } = item
  const { style: springStyle, children: extraChildren, ...modeProps } = useMode(
    item,
    mode
  )
  return (
    <animated.div
      className="absolute"
      style={{ top, left, width, height, ...springStyle }}
      {...modeProps}
    >
      {text}
      {extraChildren}
    </animated.div>
  )
}

export default CanvasText
