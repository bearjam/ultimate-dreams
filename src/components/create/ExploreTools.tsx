import React, { Fragment } from "react"
import ImageLibrary from "./ImageLibrary"
import TextForm from "./TextForm"

const ExploreTools = () => {
  return (
    <Fragment>
      <TextForm className="border-red-500 border p-4 m-4" />
      <ImageLibrary />
    </Fragment>
  )
}

export default ExploreTools
