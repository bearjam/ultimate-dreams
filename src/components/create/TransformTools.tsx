import clsx from "clsx"
import { map } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import React, { HTMLProps, SVGProps } from "react"
import { animated, Spring } from "react-spring"
import shallow from "zustand/shallow"
import { useCanvasStore } from "../../stores/canvas"
import { CanvasMode } from "../../types/canvas"
import SvgCropIcon from "../SvgCropIcon"
import SvgMoveIcon from "../SvgMoveIcon"
import SvgRotateIcon from "../SvgRotateIcon"
import SvgScaleIcon from "../SvgScaleIcon"
import SvgSelectIcon from "../SvgSelectIcon"
import css from "./TransformTools.module.css"

type Props = HTMLProps<HTMLDivElement>

const modeIcons: [
  CanvasMode,
  (props: SVGProps<SVGSVGElement>) => JSX.Element
][] = [
  ["SELECT", SvgSelectIcon],
  ["MOVE", SvgMoveIcon],
  ["SCALE", SvgScaleIcon],
  ["ROTATE", SvgRotateIcon],
  ["CROP", SvgCropIcon],
]

const TransformTools = ({ className, ...props }: Props) => {
  const [mode, dispatch] = useCanvasStore(
    (store) => [store.state.mode, store.dispatch],
    shallow
  )
  return (
    <div className={clsx(css.root, className)} {...props}>
      {pipe(
        modeIcons,
        map(([iconMode, Icon]) => (
          <Spring
            key={iconMode}
            from={{ scale: 0.66, opacity: 0.8 }}
            to={{ scale: 1.33, opacity: 1 }}
            reverse={iconMode !== mode}
          >
            {(style) => (
              <animated.div
                style={style as any}
                onClick={() =>
                  dispatch({ type: "SET_MODE", payload: iconMode })
                }
              >
                <Icon />
              </animated.div>
            )}
          </Spring>
        ))
      )}
    </div>
  )
}

export default TransformTools
