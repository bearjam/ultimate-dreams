import clsx from "clsx"
import { HTMLProps } from "react"
import { useCanvasStore } from "../../stores/canvas"
import { CanvasTextItem } from "../../types/canvas"
import Text from "../Text"
import css from "./Canvas.module.css"

const Canvas = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const { items, mode, dispatch } = useCanvasStore(
    ({ state: { items, mode }, dispatch }) => ({
      items,
      mode,
      dispatch,
    })
  )
  return (
    <div className={clsx(css.root, className)} {...props}>
      {items.map(
        (item) =>
          ({
            IMAGE: <div>image todo</div>,
            TEXT: <Text key={item.id} {...(item as CanvasTextItem)} />,
          }[item.type])
      )}
    </div>
  )
}

export default Canvas
