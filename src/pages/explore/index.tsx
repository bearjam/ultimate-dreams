import React from "react"
import useSWR from "swr"
import { Basic } from "unsplash-js/dist/methods/topics/types"
import Image from "../../components/Image"
import Link from "../../components/Link"
import { parseWidthHeight } from "../../lib/util"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const ExplorePage = () => {
  const { data, error } = useSWR<{ results: Basic[]; total: number }>(
    `/api/topics`,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <article>
      <h2>topics</h2>
      {data.results.map((topic) => (
        <Link key={topic.id} href={`/explore/${topic.slug}`}>
          <a>
            <div>
              <h2>{topic.title}</h2>
              {topic.cover_photo ? (
                <Image
                  src={topic.cover_photo.urls.regular}
                  {...parseWidthHeight(
                    topic.cover_photo.urls.regular,
                    topic.cover_photo.height / topic.cover_photo.width
                  )}
                />
              ) : null}
            </div>
          </a>
        </Link>
      ))}
    </article>
  )
}

export default ExplorePage
