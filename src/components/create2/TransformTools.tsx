import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import SvgDeleteIcon from "icons/SvgDeleteIcon"
import React, { SVGProps } from "react"
import { animated, Spring } from "react-spring"
import shallow from "zustand/shallow"
import SvgCropIcon from "../../icons/SvgCropIcon"
import SvgRotateIcon from "../../icons/SvgRotateIcon"
import SvgScaleIcon from "../../icons/SvgScaleIcon"
import SvgSelectIcon from "../../icons/SvgSelectIcon"
import { useCanvasStore } from "../../stores/canvas"
import { CanvasMode } from "../../types/canvas"
import css from "./index.module.css"

const modeIcons: [
  CanvasMode,
  (props: SVGProps<SVGSVGElement>) => JSX.Element
][] = [
  ["SELECT", SvgSelectIcon],
  ["SCALE", SvgScaleIcon],
  ["ROTATE", SvgRotateIcon],
  ["CROP", SvgCropIcon],
]

const TransformTools = () => {
  const [mode, dispatch] = useCanvasStore(
    (store) => [store.state.mode, store.dispatch],
    shallow
  )
  // see if any selected item(s)
  // if so then show available ops, e.g. TRASH
  return (
    <div className={css.transformTools}>
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
                  dispatch({
                    type: "UPDATE_CANVAS",
                    payload: { mode: iconMode },
                  })
                }
              >
                <Icon />
              </animated.div>
            )}
          </Spring>
        )),
        (children) => {
          switch (mode) {
            case "SELECT": {
              return [
                ...children,
                <div
                  key="DELETE_SELECTED_ITEMS"
                  onClick={() =>
                    dispatch({
                      type: "DELETE_SELECTED_ITEMS",
                    })
                  }
                >
                  <SvgDeleteIcon />
                </div>,
              ]
            }
            default:
              return children
          }
        }
      )}
    </div>
  )
}

export default TransformTools
