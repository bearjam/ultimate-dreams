import { withUndoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/lib/Array"
import create from "zustand"
import { persist } from "zustand/middleware"
import { CanvasAction, CanvasItem, CanvasState } from "../../types/canvas"

const initialState: CanvasState = {
  mode: "SELECT",
  items: [],
  selectedItems: [],
}

const reducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  switch (action.type) {
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      }
    case "INSERT":
      const next = {
        ...state,
        items: [...state.items, action.payload],
        selectedItems: [action.payload],
      }
      console.log(next)
      return next
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

export const useCanvasStore = create(
  persist(withUndoableReducer(reducer, initialState), { name: "canvasStore" })
)
