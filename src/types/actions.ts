import { ImageItem, TextItem } from "./items"

export type InsertTextAction = {
  type: "INSERT_TEXT"
  payload: TextItem
}

export type InsertImageAction = {
  type: "INSERT_IMAGE"
  payload: ImageItem
}

export type Action = InsertTextAction | InsertImageAction
