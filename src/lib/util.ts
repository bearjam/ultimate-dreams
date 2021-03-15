import { parseUrl } from "query-string"
import * as z from "zod"

export const identity = <T extends unknown>(x: T) => x

export const parseWidthHeight = (url: string, ratio: number) => {
  const {
    query: { w: width },
  } = z
    .object({
      query: z
        .object({
          w: z.string(),
        })
        .nonstrict(),
    })
    .nonstrict()
    .parse(parseUrl(url))
  return { width, height: ratio * parseInt(width) }
}

const { abs } = Math

export const nearestNumber = (xs: number[]) => (x: number) =>
  xs.reduce((acc, v) => (abs(v - x) < abs(acc - x) ? v : acc))
