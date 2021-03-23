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

export type CanvasItemT = CanvasImageItem | CanvasTextItem

export type CanvasMode = "SELECT" | "MOVE" | "SCALE" | "ROTATE" | "CROP"

export type XYCoord = {
  x: number
  y: number
}

export type CanvasState = {
  mode: CanvasMode
  items: CanvasItemT[]
  selectedItems: CanvasItemT[]
  pan: XYCoord
  zoom: number
}

export type InsertCanvasItemAction = {
  type: "INSERT"
  payload: CanvasItemT
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

export type UpdatePanAction = {
  type: "UPDATE_PAN"
  payload: {
    dx: number
    dy: number
  }
}

export type UpdateZoomAction = {
  type: "UPDATE_ZOOM"
  payload: {
    zoom: number
  }
}

export type MoveCanvasItemAction = {
  type: "MOVE_ITEM"
  payload: {
    itemId: string
    dx: number
    dy: number
  }
}

export type CanvasAction =
  | InsertCanvasItemAction
  | DeleteCanvasItemAction
  | DeleteAllCanvasItemsAction
  | SetModeAction
  | UpdatePanAction
  | UpdateZoomAction
  | MoveCanvasItemAction
