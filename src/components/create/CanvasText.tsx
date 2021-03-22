import React from "react"
import { CanvasTextItem } from "types/canvas"

const CanvasText = (props: CanvasTextItem) => {
  const { text, top, left, width, height } = props
  return (
    <div className="absolute" style={{ top, left, width, height }}>
      {text}
    </div>
  )
}

export default CanvasText
