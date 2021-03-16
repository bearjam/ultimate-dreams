import { withUndoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/lib/Array"
import create from "zustand"
import { CanvasAction, CanvasItem, CanvasState } from "../../types/canvas"

const initialState: CanvasState = {
  mode: "SELECT",
  items: [],
  selectedItems: [],
}

const reducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  switch (action.type) {
    case "INSERT":
      return {
        ...state,
        items: [...state.items, action.payload],
        selectedItems: [action.payload],
      }
    case "DELETE":
      return {
        ...state,
        selectedItems: filter<CanvasItem>(
          (item) => item.id !== action.payload.id
        )(state.selectedItems),
        items: filter<CanvasItem>((item) => item.id !== action.payload.id)(
          state.items
        ),
      }
    case "DELETE_ALL":
      return {
        ...state,
        items: [],
        selectedItems: [],
      }
    default:
      return state
  }
}

export const useCanvasStore = create(withUndoableReducer(reducer, initialState))
