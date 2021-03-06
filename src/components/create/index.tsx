import SvgCloseIcon from "icons/SvgCloseIcon"
import SvgPlusIcon from "icons/SvgPlusIcon"
import React from "react"
import ReactModal from "react-modal"
import { useMedia, useToggle } from "react-use"
import theme from "tailwindcss/defaultTheme"
import AssetTools from "./AssetTools"
import Canvas from "./Canvas"
import css from "./index.module.css"
import TransformTools from "./TransformTools"

ReactModal.setAppElement("#__next")

const Create = () => {
  const big = useMedia(`(min-width: ${theme.screens.sm})`)
  const [assetToolsOpen, toggleAssetTools] = useToggle(false)

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
