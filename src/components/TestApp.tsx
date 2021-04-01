import { withReducer } from "@bearjam/tom"
import { useSpring } from "@react-spring/core"
import { animated } from "@react-spring/web"
import produce from "immer"
import React from "react"
import { useDrag } from "react-use-gesture"
import { FullSpring } from "types/geometry"
import create from "zustand"

type S = {
  translate: [number, number]
  spring: FullSpring<{ translate: [number, number] }>
}

const initialState: S = {
  translate: [0, 0],
  spring: useSpring<{ translate: [number, number] }>(() => ({
    translate: [0, 0],
  })),
}

type A = { type: "UPDATE"; payload: { dx: number; dy: number } }

const reducer = (state: S, action: A): S => {
  switch (action.type) {
    case "UPDATE":
      return produce(state, (draft) => {
        draft.translate[0] += action.payload.dx
        draft.translate[1] += action.payload.dy
      })
    default:
      return state
  }
}

export const useStore = create(withReducer(reducer, initialState))

const TestApp = () => {
  const [{ translate }, set] = useStore((store) => store.state.spring)
  const bind = useDrag(({ down, movement: translate }) => {
    if (down) set({ translate })
  })
  return (
    <animated.div
      className="w-64 h-64 bg-red-500"
      style={{ translate }}
      {...bind()}
    />
  )
}

export default TestApp
