import { parseUrl } from "query-string"
import { UnsplashPhotoT } from "types/unsplash"
import * as z from "zod"

const { abs, min } = Math

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

export const nearestNumber = (xs: number[]) => (x: number) =>
  xs.reduce((acc, v) => (abs(v - x) < abs(acc - x) ? v : acc))

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const getWidth = () => {
  return !window ? 600 : min(window.innerWidth, 1600)
}

export const getWidthHeight = (photo: UnsplashPhotoT) => {
  let width = getWidth()
  return { width, height: (photo.height / photo.width) * width }
}

export const springConfig = {
  mass: 0.5,
  tension: 500,
  friction: 25,
}

export const isSSR = () => typeof window === "undefined"
