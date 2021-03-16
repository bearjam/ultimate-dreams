import clsx from "clsx"
import React, { HTMLProps } from "react"
import SvgCropIcon from "../SvgCropIcon"
import SvgDeleteIcon from "../SvgDeleteIcon"
import SvgMoveIcon from "../SvgMoveIcon"
import SvgRotateIcon from "../SvgRotateIcon"
import SvgScaleIcon from "../SvgScaleIcon"
import SvgSelectIcon from "../SvgSelectIcon"
import css from "./TransformTools.module.css"

type Props = HTMLProps<HTMLDivElement>

const TransformTools = ({ className, ...props }: Props) => {
  return (
    <div className={clsx(css.root, className)} {...props}>
      <SvgSelectIcon />
      <SvgMoveIcon />
      <SvgScaleIcon />
      <SvgRotateIcon />
      <SvgCropIcon />
      <SvgDeleteIcon />
    </div>
  )
}

export default TransformTools
