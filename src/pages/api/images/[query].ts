import { NextApiRequest, NextApiResponse } from "next"
import { serializeError } from "serialize-error"
import { createApi } from "unsplash-js"
import * as z from "zod"

const reqP = z.object({
  query: z.string().nonempty(),
})

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = reqP.parse(req.query)
    const api = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY! })
    const images = await api.search.getPhotos({ query })
    res.json({ images })
  } catch (e) {
    res.status(400).json({ error: serializeError(e) })
  }
}
