import clsx from "clsx"
import React, { HTMLProps } from "react"
import ImageBin from "./ImageBin"
import TextForm from "./TextForm"
import css from "./AssetTools.module.css"

const AssetTools = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  return (
    <div className={clsx(css.root, className)} {...props}>
      <TextForm className="border-red-500 border p-4 m-4" />
      <ImageBin />
    </div>
  )
}

export default AssetTools
