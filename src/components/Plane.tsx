import { animated, useSpring } from "@react-spring/three"
import { Fragment } from "react"
import { Color, useThree } from "react-three-fiber"
import { useGesture } from "react-use-gesture"
import { CanvasMode, GestureHandlers } from "types/canvas"

const Handle = () => {
  return (
    <animated.mesh>
      <circleBufferGeometry args={[5, 32]} />
      <meshBasicMaterial color="tomato" />
    </animated.mesh>
  )
}

type PlaneProps = {
  width: number
  height: number
  color: Color
  mode: CanvasMode
}

const Plane = ({ mode, width, height, color }: PlaneProps) => {
  const {
    camera: { zoom },
  } = useThree()
  const [matrix, set] = useSpring(() => ({
    r: 0,
    tx: 0,
    ty: 0,
    s: 0,
  }))
  function getGestures(mode: CanvasMode): GestureHandlers {
    switch (mode) {
      case "MOVE":
        return {
          onDrag: () => {},
        }
      default:
        return {
          onDrag: () => {},
        }
    }
  }
  const bind = useGesture(getGestures(mode), {
    transform: ([x, y]) => [x / zoom, -y / zoom],
  })
  function getHandles(mode: CanvasMode) {
    switch (mode) {
      case "SCALE":
        return [...Array(4)].map((_, i) => <Handle key={i} {...bind()} />)
      default:
        return null
    }
  }
  return (
    <Fragment>
      <animated.mesh {...bind()}>
        <planeBufferGeometry args={[width, height]} />
        <meshBasicMaterial color={color} />
      </animated.mesh>
      {getHandles(mode)}
    </Fragment>
  )
}

export default Plane
