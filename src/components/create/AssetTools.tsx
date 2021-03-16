import React, { Fragment } from "react"
import ImageBin from "./ImageBin"
import TextForm from "./TextForm"

const AssetTools = () => {
  return (
    <Fragment>
      <TextForm className="border-red-500 border p-4 m-4" />
      <ImageBin />
    </Fragment>
  )
}

export default AssetTools
