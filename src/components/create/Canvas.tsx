import clsx from "clsx"
import SvgCloseIcon from "icons/SvgCloseIcon"
import { HTMLProps, useState } from "react"
import SvgPlusIcon from "../../icons/SvgPlusIcon"
import { useCanvasStore } from "../../stores/canvas"
import { CanvasImageItem, CanvasTextItem } from "../../types/canvas"
import Text from "../Text"
import css from "./Canvas.module.css"
import CanvasImage from "./CanvasImage"
import PhotoBin from "./PhotoBin"

const Canvas = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const { items, mode, dispatch } = useCanvasStore(
    ({ state: { items, mode }, dispatch }) => ({
      items,
      mode,
      dispatch,
    })
  )
  const [showPhotoBin, setShowPhotoBin] = useState(false)
  const closePhotoBin = () => void setShowPhotoBin(false)
  const openPhotoBin = () => void setShowPhotoBin(true)
  return (
    <div className={clsx(css.root, className)} {...props}>
      {!showPhotoBin ? (
        <button onClick={openPhotoBin}>
          <SvgPlusIcon />
        </button>
      ) : (
        <div className={css["photo-bin-popup"]}>
          <PhotoBin onDispatch={closePhotoBin} />
          <button aria-label="close" onClick={closePhotoBin}>
            <SvgCloseIcon />
          </button>
        </div>
      )}
      {items.map(
        (item) =>
          ({
            IMAGE: <CanvasImage key={item.id} {...(item as CanvasImageItem)} />,
            TEXT: <Text key={item.id} {...(item as CanvasTextItem)} />,
          }[item.type])
      )}
    </div>
  )
}

export default Canvas
