import clsx from "clsx"
import React, { HTMLProps } from "react"
import ImageBin from "./ImageBin"
import TextForm from "../TextForm"
import css from "./AssetTools.module.css"
import { useCanvasStore } from "stores/canvas"
import { insertCanvasTextItemAction } from "stores/canvas/actions"

const AssetTools = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const dispatch = useCanvasStore((store) => store.dispatch)
  return (
    <div className={clsx(css.root, className)} {...props}>
      <TextForm
        className="border-red-500 border p-4 m-4"
        onSubmit={(text) => dispatch(insertCanvasTextItemAction({ text }))}
      />
      <ImageBin />
    </div>
  )
}

export default AssetTools
