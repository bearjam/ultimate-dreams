import { useStore } from "../../lib/store"
import { TextItem } from "../../types/items"
import Text from "../Text"

const Canvas = () => {
  const { items, mode, dispatch } = useStore(
    ({ state: { items, mode }, dispatch }) => ({
      items,
      mode,
      dispatch,
    })
  )
  return (
    <div className="fixed w-full h-full bg-indigo-100">
      <article>
        <h2>Canvas</h2>
      </article>
      {items.map(
        (item) =>
          ({
            IMAGE: <div>image todo</div>,
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
