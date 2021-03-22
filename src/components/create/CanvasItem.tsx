import React, { PropsWithChildren } from "react"
import { animated } from "react-spring"
import useMode from "src/hooks/useMode"
import { useCanvasStore } from "stores/canvas"
import { CanvasImageItem, CanvasItemT, CanvasTextItem } from "types/canvas"
import CanvasImage from "./CanvasImage"
import CanvasText from "./CanvasText"

const CanvasMode = ({ children }: PropsWithChildren<{}>) => {
  const mode = useCanvasStore((store) => store.state.mode)
  const modeProps = useMode(mode)
  // return <animated.div {...(modeProps as any)}>{children}</animated.div>
  return (
    <div className="select-none touch-action-none" {...(modeProps as any)}>
      {children}
    </div>
  )
}

type Props = {
  item: CanvasItemT
}

const CanvasItem = ({ item }: Props) => {
  const render = () => {
    switch (item.type) {
      case "IMAGE":
        return <CanvasImage {...(item as CanvasImageItem)} />
      case "TEXT":
        return <CanvasText {...(item as CanvasTextItem)} />
    }
  }
  return <CanvasMode>{render()}</CanvasMode>
}

export default CanvasItem
