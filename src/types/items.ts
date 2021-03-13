import * as z from "zod"

export const widthHeightTopLeftP = z
  .object({
    width: z.number(),
    height: z.number(),
    top: z.number(),
    left: z.number(),
  })
  .nonstrict()

export type WidthHeightTopLeft = z.infer<typeof widthHeightTopLeftP>

export const matrix2DP = z.object({
  a: z.number(),
  b: z.number(),
  c: z.number(),
  d: z.number(),
  e: z.number(),
  f: z.number(),
})

export const itemBaseP = z
  .object({
    id: z.string().nonempty(),
    z: z.number().int().optional(),
    matrix: matrix2DP.optional(),
  })
  .merge(widthHeightTopLeftP)

export type ItemBase = z.infer<typeof itemBaseP>

export const imageItemP = itemBaseP.extend({
  type: z.literal("IMAGE"),
  src: z.string().url(),
  naturalWidth: z.number(),
  naturalHeight: z.number(),
})

export type ImageItem = z.infer<typeof imageItemP>

export const textItemP = itemBaseP.extend({
  type: z.literal("TEXT"),
  text: z.string(),
})

export type TextItem = z.infer<typeof textItemP>

export const itemP = z.union([imageItemP, textItemP])

export type Item = z.infer<typeof itemP>
