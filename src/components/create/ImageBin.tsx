import { getWidth, getWidthHeight } from "lib/util"
import React from "react"
import { useCanvasStore } from "stores/canvas"
import { insertCanvasImageItemAction } from "stores/canvas/actions"
import { usePhotoStore } from "../../stores/photos"
import UnsplashPhoto from "../UnsplashPhoto"

const ImageBin = () => {
  const photos = usePhotoStore((store) => store.state.photos)
  const canvasDispatch = useCanvasStore((store) => store.dispatch)
  return (
    <div>
      {photos.map((photo) => (
        <UnsplashPhoto
          key={photo.id}
          photo={photo}
          onClick={() =>
            void canvasDispatch(
              insertCanvasImageItemAction({
                id: photo.id,
                ...getWidthHeight(photo),
              })
            )
          }
        />
      ))}
    </div>
  )
}

export default ImageBin
