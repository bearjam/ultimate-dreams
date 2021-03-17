import { filter, map } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import React from "react"
import useSWR from "swr"
import shallow from "zustand/shallow"
import { fetcher } from "lib/util"
import { usePhotoStore } from "stores/photos"
import { UnsplashPhotoT } from "types/unsplash"
import UnsplashPhoto from "components/UnsplashPhoto"

type Props = {
  topic: string
}

const TopicImages = ({ topic }: Props) => {
  const [ids, dispatch] = usePhotoStore(
    (store) => [store.state.photos.map((p) => p.id), store.dispatch],
    shallow
  )
  const { data, error } = useSWR<{ results: UnsplashPhotoT[]; total: number }>(
    `/api/topics/${topic}`,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <div className="flex flex-wrap">
      {pipe(
        data.results,
        filter((x) => !ids.includes(x.id)),
        map((result) => (
          <div
            key={result.id}
            className="w-64 p-4"
            onClick={() => dispatch({ type: "INSERT", payload: result })}
          >
            <UnsplashPhoto photo={result} />
          </div>
        ))
      )}
    </div>
  )
}

export default TopicImages
