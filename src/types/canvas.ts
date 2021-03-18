import * as z from "zod"
import { UnsplashPhotoT } from "./unsplash"

export type WidthHeightTopLeft = {
  width: number
  height: number
  top: number
  left: number
}

export type CanvasItemBase = WidthHeightTopLeft & {
  id: string
  z?: number
}

export type CanvasImageItem = CanvasItemBase & {
  type: "IMAGE"
  src: string
}

export type CanvasTextItem = CanvasItemBase & {
  type: "TEXT"
  text: string
}

export type CanvasItem = CanvasImageItem | CanvasTextItem

export type CanvasMode = "SELECT" | "MOVE" | "SCALE" | "ROTATE" | "CROP"

export type CanvasState = {
  mode: CanvasMode
  items: CanvasItem[]
  selectedItems: CanvasItem[]
}

export type InsertCanvasItemAction = {
  type: "INSERT"
  payload: CanvasItem
}

export type DeleteCanvasItemAction = {
  type: "DELETE"
  payload: {
    id: string
  }
}

export type DeleteAllCanvasItemsAction = {
  type: "DELETE_ALL"
}

export type SetModeAction = {
  type: "SET_MODE"
  payload: CanvasMode
}

export type CanvasAction =
  | InsertCanvasItemAction
  | DeleteCanvasItemAction
  | DeleteAllCanvasItemsAction
  | SetModeAction
