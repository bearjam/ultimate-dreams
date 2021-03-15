import React from "react"
import useSWR from "swr"
import { Photos } from "unsplash-js/dist/methods/search/types/response"
import Image from "../Image"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const collections = ["places", "people", "nature", "textures"]

const ImageLibrary = () => {
  return (
    <article>
      <h2>collections</h2>
    </article>
  )
}

export default ImageLibrary
