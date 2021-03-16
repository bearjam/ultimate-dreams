import React from "react"
import { CanvasTextItem } from "../types/canvas"

const Text = (props: CanvasTextItem) => {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
}

export default Text
