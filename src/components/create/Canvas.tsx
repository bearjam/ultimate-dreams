import { map } from "fp-ts/lib/Array"
import { toArray } from "fp-ts/lib/Record"
import { snd } from "fp-ts/lib/Tuple"
import { useStore } from "../../lib/store"
import { ImageItem, TextItem } from "../../types/items"
import Image from "./Image"
import Text from "./Text"

const Canvas = () => {
  const { items, mode, dispatch } = useStore(({ state, dispatch }) => ({
    items: map(snd)(toArray(state.items)),
    mode: state.mode,
    dispatch,
  }))
  return (
    <div className="fixed w-full h-full bg-indigo-100">
      {items.map(
        (item) =>
          ({
            IMAGE: <Image key={item.id} {...(item as ImageItem)} />,
            TEXT: <Text key={item.id} {...(item as TextItem)} />,
          }[item.type])
      )}
      <button onClick={() => void dispatch({ type: "DELETE_ALL_ITEMS" })}>
        delete all
      </button>
    </div>
  )
}

export default Canvas
