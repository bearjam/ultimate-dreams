import React from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const UnsplashTestPage = () => {
  const r = useSWR("/api/images/textures", fetcher)

  return (
    <div>
      <pre>{JSON.stringify(r, null, 2)}</pre>
    </div>
  )
}

export default UnsplashTestPage
