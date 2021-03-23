import { selectMode } from "lib/modes"
import NextImage from "next/image"
import { forwardRef } from "react"
import { animated } from "react-spring"
import { CanvasImageItem, CanvasMode } from "types/canvas"

const useMode = (item: CanvasImageItem, mode: CanvasMode) => {
  switch (mode) {
    default:
      return selectMode(item)
  }
}

type Props = {
  item: CanvasImageItem
  mode: CanvasMode
}

const CanvasImage = forwardRef<HTMLDivElement, Props>(({ item, mode }, ref) => {
  const { src, width, height, top, left } = item
  const { style: springStyle, children: extraChildren, ...modeProps } = useMode(
    item,
    mode
  )
  return (
    <animated.div
      className="absolute"
      style={{ width, height, top, left, ...springStyle }}
      {...modeProps}
      ref={ref}
    >
      <NextImage
        className="touch-action-none select-none pointer-events-none"
        src={src}
        width={width}
        height={height}
      />
      {extraChildren}
    </animated.div>
  )
})

export default CanvasImage
