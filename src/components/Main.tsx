import React, { Fragment } from "react"
import { CanvasMode } from "types/canvas"
import Plane from "./Plane"

const plane = {
  id: "foo",
  width: 321,
  height: 123,
  color: "steelblue",
  mode: "SCALE" as CanvasMode,
}

const Main = () => {
  return (
    <Fragment>
      {[plane].map((props) => (
        <Plane key={props.id} {...props} />
      ))}
    </Fragment>
  )
}

export default Main
