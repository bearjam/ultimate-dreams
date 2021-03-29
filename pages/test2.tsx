import { Interpolation, to, useSpring } from "@react-spring/core"
import { animated } from "@react-spring/three"
import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import { filterWithIndex } from "fp-ts/ReadonlyRecord"
import dynamic from "next/dynamic"
import React, { Fragment } from "react"
import { Canvas, useResource, useThree } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import theme from "tailwindcss/defaultTheme"
import { Mesh } from "three"

const { hypot, pow, sqrt, sign } = Math
const sq = (v: number) => pow(v, 2)

const xSign = (ord: number) => (ord % 2 === 0 ? -1 : 1)
const ySign = (ord: number) => (ord < 2 ? 1 : -1)

type HandleProps = {
  ord: number
  position: Interpolation<[number, number, number]>
  scale: Interpolation<[number, number, number]>
  item: {
    width: number
    height: number
  }
}
const Handle = (props: HandleProps) => {
  const { ord, item } = props

  const position = to([props.position], ([x, y, z]) => [
    x + xSign(ord) * (item.width / 2),
    y + ySign(ord) * (item.height / 2),
    z + 1,
  ])
  const scale = to([props.scale], ([scale]) => [scale, scale, 1])
  const restProps = filterWithIndex(
    (k) => !["ord", "position", "scale", "item"].includes(k)
  )(props)
  return (
    <animated.mesh
      position={position as any}
      scale={scale as any}
      {...restProps}
    >
      <circleBufferGeometry args={[5, 16]} />
      <meshBasicMaterial color={theme.colors.blue[500]} />
    </animated.mesh>
  )
}

type PlaneProps = {
  withHandles: boolean
  width: number
  height: number
  x: number
  y: number
  z: number
  scale: number
}
const Plane = (props: PlaneProps) => {
  const {
    camera: { zoom },
  } = useThree()

  const [{ x, y, z }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    z: 0,
  }))

  const position = to([x, y], (x, y) => [props.x + x, props.y + y, 0])
  const scale = to([z], (z) => [props.scale + z, props.scale + z, 1])

  const { width, height } = props

  const bind = useDrag(
    ({ args: [ord], movement: [x, y], down }) => {
      const a = sign(x) * sq(x) + sign(y) * sq(y)
      const b = sign(a) * sqrt(a)
      const c = hypot(width / height)
      const d = b / c
      set(
        down
          ? {
              // x,
              // y,
              z: d,
            }
          : { x: 0, y: 0, z: 0 }
      )
    },
    {
      transform: ([x, y]) => [x / zoom, -y / zoom],
    }
  )

  return (
    <Fragment>
      <animated.mesh position={position as any} scale={scale as any}>
        <boxBufferGeometry args={[width, height]} />
        <meshBasicMaterial color={theme.colors.red[500]} />
      </animated.mesh>
      {props.withHandles &&
        [...Array(4)].map((_, i) => (
          <Handle
            key={i}
            ord={i}
            position={position}
            scale={scale}
            item={{
              width,
              height,
            }}
            {...bind(i)}
          />
        ))}
    </Fragment>
  )
}

const planeProps = {
  width: 100,
  height: 100,
  x: 200,
  y: 100,
  z: 0,
  scale: 1,
}

const CanvasMain = () => {
  return (
    <Fragment>
      <Plane withHandles {...planeProps} />
    </Fragment>
  )
}

const Test2Page = () => {
  return (
    <div className="absolute w-full h-full bg-gray-200 touch-action-none">
      <Canvas orthographic>
        <CanvasMain />
      </Canvas>
    </div>
  )
}

// @ts-ignore
Test2Page.Layout = dynamic(() =>
  import("src/layouts").then((mod) => mod.NoopLayout)
)

export default Test2Page
