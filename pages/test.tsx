import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import dynamic from "next/dynamic"
import React, { Fragment } from "react"
import { Canvas, useResource } from "react-three-fiber"
import theme from "tailwindcss/defaultTheme"
import { Mesh } from "three"

type HandleProps = {
  plane: Omit<PlaneProps, "withHandles">
  ord: number
}
const Handle = (props: HandleProps) => {
  const { plane, ord } = props

  const xSign = ord % 2 === 0 ? (v: number) => v : (v: number) => -v
  const ySign = ord < 2 ? (v: number) => v : (v: number) => -v

  return (
    <mesh
      position={
        pipe(
          [
            plane.x + xSign(plane.width / 2),
            plane.y + ySign(plane.height / 2),
            plane.z + 1,
          ],
          map((v) => v * plane.scale)
        ) as [number, number, number]
      }
      scale={[plane.scale, plane.scale, plane.scale]}
    >
      <circleBufferGeometry args={[0.03, 16]} />
      <meshBasicMaterial color={theme.colors.blue[500]} />
    </mesh>
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
  const { withHandles, ...rest } = props
  const { width, height, x, y, z, scale } = rest
  const ref = useResource<Mesh>()
  return (
    <Fragment>
      <mesh ref={ref} position={[x, y, z]} scale={[scale, scale, 1]}>
        <boxBufferGeometry args={[width, height]} />
        <meshBasicMaterial color={theme.colors.red[500]} />
      </mesh>
      {withHandles &&
        [...Array(4)].map((_, i) => <Handle key={i} ord={i} plane={rest} />)}
    </Fragment>
  )
}

const planeProps = {
  width: 1,
  height: 1,
  x: 0,
  y: 0,
  z: 0,
  scale: 2,
}

const CanvasMain = () => {
  return (
    <Fragment>
      <Plane withHandles {...planeProps} />
    </Fragment>
  )
}

const TestPage = () => {
  return (
    <div className="absolute w-full h-full bg-gray-200 touch-action-none">
      <Canvas orthographic camera={{ zoom: 100 }}>
        <CanvasMain />
      </Canvas>
    </div>
  )
}

// @ts-ignore
TestPage.Layout = dynamic(() =>
  import("src/layouts").then((mod) => mod.NoopLayout)
)

export default TestPage
