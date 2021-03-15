import React from "react"
import useSWR from "swr"
import { Basic } from "unsplash-js/dist/methods/photos/types"
import { parseWidthHeight } from "../lib/util"
import Image from "./Image"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Props = {
  topic: string
}

const TopicImages = ({ topic }: Props) => {
  const { data, error } = useSWR<{ results: Basic[]; total: number }>(
    `/api/topics/${topic}`,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <div className="flex flex-wrap">
      {data.results.map((result) => (
        <div key={result.id} className="w-64 p-4">
          <Image
            src={result.urls.regular}
            {...parseWidthHeight(
              result.urls.regular,
              result.height / result.width
            )}
          />
        </div>
      ))}
    </div>
  )
}

export default TopicImages
