import { Item } from "./items"

export type InsertItemAction = {
  type: "INSERT_ITEM"
  payload: Item
}

export type DeleteItemAction = {
  type: "DELETE_ITEM"
  payload: {
    id: string
  }
}

export type DeleteAllItemsAction = {
  type: "DELETE_ALL_ITEMS"
}

export type Action = InsertItemAction | DeleteItemAction | DeleteAllItemsAction
