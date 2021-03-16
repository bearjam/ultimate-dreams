import { stringifyUrl } from "query-string"
import React from "react"
import { UnsplashPhotoT } from "../types/unsplash"
import Image from "./Image"

type Props = {
  photo: UnsplashPhotoT
  width?: number
}

const UnsplashPhoto = ({ photo, width = window?.innerWidth ?? 600 }: Props) => {
  const ratio = photo.height / photo.width
  const url = stringifyUrl({
    url: photo.urls.raw,
    query: { w: width },
  })
  return <Image src={url} width={width} height={ratio * width} />
}

export default UnsplashPhoto
