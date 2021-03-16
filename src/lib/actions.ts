import { v4 as uuid } from "uuid"
import { InsertItemAction } from "../types/actions"
import {
  ImageItem,
  TextItem,
  WidthHeightTopLeft,
  widthHeightTopLeftP,
} from "../types/items"
import { UnsplashPhotoT } from "../types/unsplash"

export const insertTextAction = ({
  id = uuid(),
  text = "hello world",
  width = 100,
  height = 100,
  top = 50,
  left = 50,
}: Partial<Omit<TextItem, "type">>): InsertItemAction => ({
  type: "INSERT_ITEM",
  payload: {
    type: "TEXT",
    id,
    text,
    width,
    height,
    top,
    left,
  },
})

export const insertUnsplashPhoto = ({
  width,
  top = 50,
  left = 50,
  photo,
}: Omit<WidthHeightTopLeft, "width"> & {
  photo: UnsplashPhotoT
  width: number
  top?: number
  left?: number
}): InsertItemAction => ({
  type: "INSERT_ITEM",
  payload: {
    type: "UNSPLASH_PHOTO",
    id: photo.id,
    photo,
    width,
    top,
    left,
  },
})
