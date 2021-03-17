import { map } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import React, { HTMLProps } from "react"
import { useCanvasStore } from "../../stores/canvas"
import { usePhotoStore } from "../../stores/photos"
import Link from "../Link"
import UnsplashPhoto from "../UnsplashPhoto"

type Props = HTMLProps<HTMLDivElement>

const PhotoBin = (props: Props) => {
  const [photos, dispatchPhoto] = usePhotoStore((store) => [
    store.state.photos,
    store.dispatch,
  ])
  const [canvasItems, dispatchCanvas] = useCanvasStore((store) => [
    store.state.items,
    store.dispatch,
  ])

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
        pipe(
          photos,
          map((photo) => <UnsplashPhoto key={photo.id} photo={photo} />)
        )
      )}
    </div>
  )
}

export default PhotoBin
