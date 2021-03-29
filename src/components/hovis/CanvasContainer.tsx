import { HTMLProps } from "react"
import css from "./index.module.css"

type CanvasContainerProps = HTMLProps<HTMLDivElement>
const CanvasContainer = ({ className, ...props }: CanvasContainerProps) => (
  <div className={css.canvasContainer} {...props} />
)

export default CanvasContainer
