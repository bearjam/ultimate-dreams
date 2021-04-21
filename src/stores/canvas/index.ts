import { withUndoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/ReadonlyArray"
import produce from "immer"
import executeCrop from "lib/crop"
import create from "zustand"
import { persist } from "zustand/middleware"
import { CanvasAction, CanvasItemT, CanvasState } from "../../types/canvas"
import localForage from "localforage"

const initialState: CanvasState = {
  mode: "SELECT",
  items: [],
  selectedItems: [],
  width: 4000,
  height: 4000,
  rotate: 0,
  translate: [0, 0],
  scale: 0.1,
}

const reducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  switch (action.type) {
    case "CROP_IMAGE":
      return produce(state, (draft) => {
        let { itemId: id, inset, htmlImage } = action.payload
        const i = draft.items.findIndex((item) => item.id === id)
        if (i !== -1) {
          draft.items[i] = {
            ...draft.items[i],
            src: executeCrop(htmlImage, inset),
          } as CanvasItemT
        }
      })
    case "SELECT_ITEMS":
      return state
    case "UPDATE_CANVAS":
      return {
        ...state,
        ...action.payload,
      }
    case "UPDATE_ITEM":
      return produce(state, (draft) => {
        let { itemId: id, ...itemRest } = action.payload
        const i = draft.items.findIndex((item) => item.id === id)
        if (i !== -1) {
          draft.items[i] = {
            ...draft.items[i],
            ...itemRest,
          } as CanvasItemT
        }
      })
    case "MOVE_ITEM":
      return produce(state, (draft) => {
        const item = draft.items.find(
          (item) => item.id === action.payload.itemId
        )
        if (item) {
          item.translate[0] += action.payload.dx
          item.translate[1] += action.payload.dy
        }
      })
    case "INSERT_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        selectedItems: [action.payload],
      }
    case "DELETE_ITEM":
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

export const useCanvasStore = create(
  persist(withUndoableReducer(reducer, initialState), {
    name: "canvasStore",
    getStorage: () => localForage as any,
  })
)

// export const useCanvasStore = create(withUndoableReducer(reducer, initialState))
