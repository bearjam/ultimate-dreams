import { withUndoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/ReadonlyArray"
import produce from "immer"
import create from "zustand"
import { persist } from "zustand/middleware"
import { CanvasAction, CanvasItemT, CanvasState } from "../../types/canvas"

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
        draft.pan.x += action.payload.dx
        draft.pan.y += action.payload.dy
      })

    case "UPDATE_ZOOM":
      return {
        ...state,
        zoom: action.payload.zoom,
      }
    case "INSERT":
      return {
        ...state,
        items: [...state.items, action.payload],
        selectedItems: [action.payload],
      }
    case "DELETE":
      return {
        ...state,
        selectedItems: [
          ...filter<CanvasItemT>((item) => item.id !== action.payload.id)(
            state.selectedItems
          ),
        ],
        items: [
          ...filter<CanvasItemT>((item) => item.id !== action.payload.id)(
            state.items
          ),
        ],
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
