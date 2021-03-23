import { useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import { useCanvasStore } from "stores/canvas"
import { CanvasItemT } from "types/canvas"

export const selectMode = (item: CanvasItemT) => {
  const [state, dispatch] = useCanvasStore((store) => [
    store.state,
    store.dispatch,
  ])
  const { zoom } = state
  const [style, set] = useSpring(() => ({
    x: 0,
    y: 0,
    config: {
      mass: 0.5,
      tension: 500,
      friction: 25,
    },
  }))
  const bind = useGesture({
    onDrag: async ({ event, movement, down }) => {
      event.preventDefault()
      event.stopPropagation()
      const [x, y] = movement.map((v) => (1 / zoom) * v)
      if (down) {
        await set({ x, y })
      } else {
        await set({ x: 0, y: 0, immediate: true })
        dispatch({
          type: "MOVE_ITEM",
          payload: {
            itemId: item.id,
            dx: x,
            dy: y,
          },
        })
      }
    },
  })

  return { style, ...bind(), children: null }
}
