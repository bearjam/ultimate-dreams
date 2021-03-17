import clsx from "clsx"
import { Fragment, HTMLProps, useState } from "react"
import { useCanvasStore } from "../../stores/canvas"
import { CanvasTextItem } from "../../types/canvas"
import Text from "../Text"
import css from "./Canvas.module.css"
import {
  animated,
  to,
  useSpring,
  useSprings,
  useTransition,
} from "react-spring"
import PhotoBin from "./PhotoBin"
import SvgPlusIcon from "../../icons/SvgPlusIcon"
import SvgDeleteIcon from "../../icons/SvgDeleteIcon"

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
          <PhotoBin />
          <button aria-label="close" onClick={closePhotoBin}>
            <SvgDeleteIcon />
          </button>
        </div>
      )}
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
