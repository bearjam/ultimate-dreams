import { Dispatcher, Patcher } from "@bearjam/tom"
import {
  EventTypes,
  NativeHandlers,
  UserHandlers,
} from "react-use-gesture/dist/types"

export type CanvasItemDimensions = {
  width: number
  height: number
}

export type CanvasItemTransforms = {
  rotate: number
  translate: XYCoord
  scale: number
}

export type CanvasItemGeometry = CanvasItemDimensions & CanvasItemTransforms

export type CanvasItemBase = CanvasItemGeometry & {
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
  width: number
  height: number
  rotate: number
  scale: number
} & XYCoord

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
    dx: number
    dy: number
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

export type CanvasAction =
  | InsertCanvasItemAction
  | DeleteCanvasItemAction
  | DeleteAllCanvasItemsAction
  | UpdateCanvasAction
  | MoveCanvasItemAction
  | PanCanvasAction
  | SelectItemsAction

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
