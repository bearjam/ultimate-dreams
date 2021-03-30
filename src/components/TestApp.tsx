import { animated, to, useSpring } from "@react-spring/web"
import { SCALE_QUOTIENT } from "lib/constants"
import React, { Fragment, HTMLProps, useState } from "react"
import { useDrag, useWheel } from "react-use-gesture"
import create from "zustand"

type T = {
  scale: number
  setScale: (next: number) => void
}
const useStore = create<T>((set) => ({
  scale: 1,
  setScale: (next) => void set(() => ({ scale: next })),
}))

const Box = () => {
  const parentScale = useStore((store) => store.scale)
  const [state, setState] = useState({
    x: 0,
    y: 0,
  })
  const [{ x: sx, y: sy }, set] = useSpring(() => ({
    x: 0,
    y: 0,
  }))
  const dragHandlers = useDrag(async ({ movement, down }) => {
    const [x, y] = movement.map((v) => v * (1 / parentScale))
    if (down) {
      set({ x, y })
    } else {
      await set({ x, y })
      await set({ x: 0, y: 0, immediate: true })
      setState((p) => ({ x: p.x + x, y: p.y + y }))
    }
  })

  const x = to([sx], (sx) => state.x + sx)
  const y = to([sy], (sy) => state.y + sy)
  return (
    <animated.div
      className="w-64 h-64 bg-red-500"
      style={{ x, y }}
      {...dragHandlers()}
    />
  )
}

type ContainerProps = HTMLProps<HTMLDivElement>
const Container = ({ children }: ContainerProps) => {
  const [scale, setScale] = useStore(({ scale, setScale }) => [scale, setScale])
  const [{ ds }, set] = useSpring(() => ({
    ds: 0,
  }))
  const wheelHandler = useWheel(async ({ wheeling, movement: [, my] }) => {
    if (wheeling) {
      set({ ds: my })
    } else {
      await set({ ds: my })
      await set({ ds: 0, immediate: true })
      setScale(scale - my / SCALE_QUOTIENT)
    }
  })
  return (
    <animated.div
      className="absolute border-2 border-black inset-0 m-auto"
      style={{
        width: 800,
        height: 600,
        scale: to([ds], (ds) => scale - ds / SCALE_QUOTIENT),
      }}
      {...wheelHandler()}
    >
      {children}
    </animated.div>
  )
}

const TestApp = () => {
  return (
    <Container>
      <Box />
    </Container>
  )
}

export default TestApp
