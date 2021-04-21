import { Dispatcher, Patcher } from "@bearjam/tom"
import {
  EventTypes,
  NativeHandlers,
  UserHandlers,
} from "react-use-gesture/dist/types"
import { Transforms2D, Dimensions2D } from "./geometry"

export type CanvasItemGeometry = Dimensions2D & Transforms2D

export type CanvasItemBase = CanvasItemGeometry & {
  id: string
  z?: number
}

export type CanvasImageItem = CanvasItemBase & {
  type: "IMAGE"
  src: string
  naturalWidth: number
  naturalHeight: number
}

export type CanvasTextItem = CanvasItemBase & {
  type: "TEXT"
  text: string
}

export type CanvasItemT = CanvasImageItem | CanvasTextItem

export type CanvasMode = "SELECT" | "MOVE" | "SCALE" | "ROTATE" | "CROP"

export type CanvasState = Dimensions2D &
  Transforms2D & {
    mode: CanvasMode
    items: CanvasItemT[]
    selectedItems: CanvasItemT[]
  }

export type InsertCanvasItemAction = {
  type: "INSERT_ITEM"
  payload: CanvasItemT
}

export type DeleteCanvasItemAction = {
  type: "DELETE_ITEM"
  payload: {
    id: string
  }
}

export type DeleteAllCanvasItemsAction = {
  type: "DELETE_ALL_ITEMS"
}

export type UpdateCanvasAction = {
  type: "UPDATE_CANVAS"
  payload: Partial<CanvasState>
}

export type MoveCanvasItemAction = {
  type: "MOVE_ITEM"
  payload: {
    itemId: string
    dx: number
    dy: number
  }
}

export type PanCanvasAction = {
  type: "PAN_CANVAS"
  payload: {
    translate: [number, number]
  }
}

export type SelectItemsAction = {
  type: "SELECT_ITEMS"
  payload: {
    x0: number
    y0: number
    x1: number
    y1: number
  }
}

export type ZoomCanvasAction = {
  type: "ZOOM_CANVAS"
  payload: {
    scaleDelta: number
  }
}

export type ScaleCanvasItemAction = {
  type: "SCALE_ITEM"
  payload: {
    itemId: string
    scaleDelta: number
  }
}

export type UpdateCanvasItemAction = {
  type: "UPDATE_ITEM"
  payload: {
    itemId: string
  } & Partial<CanvasItemT>
}

export type CropCanvasImageItemAction = {
  type: "CROP_IMAGE"
  payload: {
    itemId: string
    inset: [number, number, number, number]
    htmlImage: HTMLImageElement
  }
}

export type CanvasAction =
  | InsertCanvasItemAction
  | DeleteCanvasItemAction
  | DeleteAllCanvasItemsAction
  | UpdateCanvasAction
  | MoveCanvasItemAction
  | PanCanvasAction
  | ZoomCanvasAction
  | SelectItemsAction
  | ScaleCanvasItemAction
  | UpdateCanvasItemAction
  | CropCanvasImageItemAction

export type CanvasStore = Dispatcher<CanvasState, CanvasAction> & Patcher

export type CanvasDispatch = (a: CanvasAction) => CanvasAction

export type GestureHandlers = Partial<
  UserHandlers<EventTypes> & NativeHandlers<EventTypes>
>

export type CanvasTransform = {
  x: number
  y: number
  scale: number
}
