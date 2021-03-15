import React from "react"
import { TextItem } from "../types/items"

const Text = (props: TextItem) => {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
}

export default Text
