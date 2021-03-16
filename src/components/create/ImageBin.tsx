import React from "react"
import { usePhotoStore } from "../../stores/photos"
import UnsplashPhoto from "../UnsplashPhoto"

const ImageBin = () => {
  const photos = usePhotoStore((store) => store.state.photos)
  return (
    <div>
      {photos.map((photo) => (
        <UnsplashPhoto key={photo.id} photo={photo} />
      ))}
    </div>
  )
}

export default ImageBin
