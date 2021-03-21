import React, { ComponentType, HTMLProps, ReactNode } from "react"
import { animated, useSpring } from "react-spring"
import { useDrag } from "react-use-gesture"

type Props = {
  children?: ReactNode
  update?: (x: number, y: number) => any
}

const AbstractMove = ({ children, update }: Props) => {
  const [style, set] = useSpring(() => ({
    x: 0,
    y: 0,
  }))
  const bind = useDrag(async ({ down, movement, offset }) => {
    if (update) {
      const [x, y] = movement
      await set({
        x,
        y,
      })
      if (!down) {
        await set({ x: 0, y: 0, immediate: true })
        update(x, y)
      }
    } else {
      const [x, y] = offset
      set({
        x,
        y,
      })
    }
  })
  return (
    <animated.div className="relative" style={style} {...bind()}>
      {children}
    </animated.div>
  )
}

export const withAbstractMove = <
  P extends { update?: (x: number, y: number) => any }
>(
  WrappedComponent: ComponentType<P>
) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const AnimatedComponent = animated(WrappedComponent)

  return ({ update }: P) => {
    const [style, set] = useSpring(() => ({
      x: 0,
      y: 0,
    }))
    const bind = useDrag(async ({ down, movement: [x, y] }) => {
      await set({
        x,
        y,
      })
      if (!down) {
        await set({ x: 0, y: 0, immediate: true })
        update?.(x, y)
      }
    })
    // @ts-ignore
    return <AnimatedComponent style={style} {...bind()} />
  }
}

export default AbstractMove
