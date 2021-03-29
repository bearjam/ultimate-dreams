import { pipe } from "fp-ts/function"
import { map } from "fp-ts/ReadonlyArray"
import { getWidthHeight } from "lib/util"
import React, { HTMLProps } from "react"
import { insertCanvasImageItemAction } from "stores/canvas/actions"
import { useCanvasStore } from "../../stores/canvas"
import { usePhotoStore } from "../../stores/photos"
import Link from "../Link"
import UnsplashPhoto from "../UnsplashPhoto"

type Props = HTMLProps<HTMLDivElement> & {
  onDispatch?: () => void
}

const PhotoBin = ({ onDispatch = () => {}, ...props }: Props) => {
  const [photos, dispatchPhoto] = usePhotoStore((store) => [
    store.state.photos,
    store.dispatch,
  ])
  const dispatchCanvas = useCanvasStore((store) => store.dispatch)

  return (
    <div {...props}>
      <article>
        <h2>photo bin</h2>
      </article>
      {photos.length < 1 ? (
        <article>
          <h3>Photo Bin Empty!</h3>
          <Link href="/explore">
            <a>
              <h4>Explore Photos?</h4>
            </a>
          </Link>
        </article>
      ) : (
        <article>
          <h2>Select any image to send to canvas</h2>
          {pipe(
            photos,
            map((photo) => (
              <UnsplashPhoto
                key={photo.id}
                photo={photo}
                onClick={() => {
                  dispatchCanvas(
                    insertCanvasImageItemAction({
                      id: photo.id,
                      src: photo.urls.regular,
                      naturalWidth: photo.width,
                      naturalHeight: photo.height,
                      ...getWidthHeight(photo),
                    })
                  )
                  onDispatch()
                }}
              />
            ))
          )}
        </article>
      )}
    </div>
  )
}

export default PhotoBin
