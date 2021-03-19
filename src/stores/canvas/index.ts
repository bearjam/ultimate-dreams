import { withUndoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/lib/Array"
import produce from "immer"
import create from "zustand"
import { persist } from "zustand/middleware"
import { CanvasAction, CanvasItem, CanvasState } from "../../types/canvas"

const initialState: CanvasState = {
  mode: "SELECT",
  items: [],
  selectedItems: [],
  pan: {
    x: 0,
    y: 0,
  },
  zoom: 0.1,
}

const reducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  switch (action.type) {
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      }
    case "UPDATE_PAN":
      return produce(state, (draft) => {
        console.log(action.payload)
        draft.pan.x += action.payload.dx
        draft.pan.y += action.payload.dy
      })
    case "UPDATE_ZOOM":
      console.log(state, "before")
      const next = {
        ...state,
        zoom: action.payload.zoom,
      }
      console.log(next, "after")
      return next
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

export const useCanvasStore = create(
  persist(withUndoableReducer(reducer, initialState), { name: "canvasStore" })
)
