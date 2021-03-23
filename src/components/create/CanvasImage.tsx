import { selectMode } from "lib/modes"
import NextImage from "next/image"
import { forwardRef } from "react"
import { animated, useSpring } from "react-spring"
import { CanvasImageItem, CanvasMode } from "types/canvas"

type Props = {
  item: CanvasImageItem
}

const CanvasImage = ({ item }: Props) => {
  const { src, width, height, top, left } = item

  return (
    <animated.div
      className="absolute mx-auto my-auto"
      style={{ width, height, top, left }}
    >
      <NextImage
        className="touch-action-none select-none pointer-events-none"
        src={src}
        width={width}
        height={height}
      />
    </animated.div>
  )
}

export default CanvasImage
