import { undoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/lib/Array"
import create from "zustand"
import { State } from "../types"
import { Action } from "../types/actions"
import { Item } from "../types/items"

const initialState: State = {
  mode: "SELECT",
  items: [],
  selectedItems: [],
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INSERT_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        selectedItems: [action.payload],
      }
    case "DELETE_ITEM":
      return {
        ...state,
        selectedItems: filter<Item>((item) => item.id !== action.payload.id)(
          state.selectedItems
        ),
        items: filter<Item>((item) => item.id !== action.payload.id)(
          state.items
        ),
      }
    case "DELETE_ALL_ITEMS":
      return {
        ...state,
        items: [],
        selectedItems: [],
      }
    default:
      return state
  }
}

export const useStore = create(undoableReducer(reducer, initialState))
