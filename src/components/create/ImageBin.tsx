import { filter, map } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import { toArray } from "fp-ts/lib/Record"
import { snd } from "fp-ts/lib/Tuple"
import React from "react"
import { useStore } from "../../lib/store"
import { Item } from "../../types/items"

const ImageBin = () => {
  const images = useStore((store) => store.state.items)
  return (
    <div>
      {images.map((image) => (
        <pre>{JSON.stringify(image, null, 2)}</pre>
      ))}
    </div>
  )
}

export default ImageBin
