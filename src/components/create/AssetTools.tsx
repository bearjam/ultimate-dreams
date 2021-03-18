import clsx from "clsx"
import React, { HTMLProps } from "react"
import TextForm from "../TextForm"
import css from "./AssetTools.module.css"
import { useCanvasStore } from "stores/canvas"
import { insertCanvasTextItemAction } from "stores/canvas/actions"
import PhotoBin from "./PhotoBin"

const AssetTools = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const dispatch = useCanvasStore((store) => store.dispatch)
  return (
    <div className={clsx(css.root, className)} {...props}>
      <TextForm
        className="border-red-500 border p-4 m-4"
        onSubmit={(text) => dispatch(insertCanvasTextItemAction({ text }))}
      />
      <PhotoBin />
    </div>
  )
}

export default AssetTools
