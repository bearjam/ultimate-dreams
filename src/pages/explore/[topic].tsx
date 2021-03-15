import { useRouter } from "next/router"
import React from "react"
import * as z from "zod"
import TopicImages from "../../components/TopicImages"

const ExploreCollectionPage = () => {
  const router = useRouter()
  const { topic } = z
    .object({
      topic: z.string(),
    })
    .parse(router.query)
  return <TopicImages topic={topic} />
}

export default ExploreCollectionPage
