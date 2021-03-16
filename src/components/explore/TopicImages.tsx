import { filter, map } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import React from "react"
import useSWR from "swr"
import { useStore } from "../../lib/store"
import { fetcher, getWidth } from "../../lib/util"
import { UnsplashPhotoT } from "../../types/unsplash"
import UnsplashPhoto from "../UnsplashPhoto"
import shallow from "zustand/shallow"
import { insertUnsplashPhoto } from "../../lib/actions"

type Props = {
  topic: string
}

const TopicImages = ({ topic }: Props) => {
  const [ids, dispatch] = useStore(
    (store) => [store.state.items.map((x) => x.id), store.dispatch],
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
            onClick={() =>
              dispatch(
                insertUnsplashPhoto({
                  photo: result,
                  width: getWidth(),
                })
              )
            }
          >
            <UnsplashPhoto photo={result} />
          </div>
        ))
      )}
    </div>
  )
}

export default TopicImages
