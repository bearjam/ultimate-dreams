import { HTMLProps } from "react"
import css from "./index.module.css"
import DomCanvas from "./DomCanvas"
import ThreeCanvas from "./ThreeCanvas"
import { useSpring } from "@react-spring/core"

type CanvasContainerProps = HTMLProps<HTMLDivElement>

const CanvasCommon = ({ className, ...props }: CanvasContainerProps) => {
  const spring = useSpring(() => ({
    dx: 0,
    dy: 0,
    dz: 0,
  }))
  return (
    <div className={css.canvasContainer} {...props}>
      <DomCanvas spring={spring} />
      <ThreeCanvas spring={spring} />
    </div>
  )
}

export default CanvasCommon
