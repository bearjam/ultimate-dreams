import { useRouter } from "next/router"
import React from "react"
import TopicImages from "../../src/components/explore/TopicImages"

const ExploreCollectionPage = () => {
  const router = useRouter()
  const { topic } = router.query
  return typeof topic === "string" ? (
    <TopicImages topic={topic} />
  ) : (
    <div>bad topic</div>
  )
}

export default ExploreCollectionPage
