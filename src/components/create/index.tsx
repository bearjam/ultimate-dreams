import React, { Fragment as div, useEffect } from "react"
import Canvas from "./Canvas"
import AssetTools from "./AssetTools"
import TransformTools from "./TransformTools"
import { useMedia, useToggle } from "react-use"
import theme from "tailwindcss/defaultTheme"
import SvgPlusIcon from "icons/SvgPlusIcon"
import css from "./index.module.css"
import ReactModal from "react-modal"
import SvgCloseIcon from "icons/SvgCloseIcon"

ReactModal.setAppElement("#__next")

const Create = () => {
  const big = useMedia(`(min-width: ${theme.screens.sm})`)
  const [assetToolsOpen, toggleAssetTools] = useToggle(false)
  // useEffect(() => void (big ? toggleAssetTools(false) : null), [big])

  return (
    <div>
      {!big ? (
        <div className={css.assetTools}>
          <button onClick={() => toggleAssetTools(true)}>
            <SvgPlusIcon />
          </button>
          <ReactModal isOpen={assetToolsOpen} onRequestClose={toggleAssetTools}>
            <AssetTools />
            <SvgCloseIcon onClick={() => toggleAssetTools(false)} />
          </ReactModal>
        </div>
      ) : (
        <AssetTools />
      )}
      <Canvas />
      <TransformTools />
    </div>
  )
}

export default Create
