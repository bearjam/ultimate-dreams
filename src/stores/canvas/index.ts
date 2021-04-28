import { withUndoableReducer } from "@bearjam/tom"
import { filter } from "fp-ts/ReadonlyArray"
import produce, { Draft } from "immer"
import executeCrop from "lib/crop"
import create from "zustand"
import { persist } from "zustand/middleware"
import { CanvasAction, CanvasItemT, CanvasState } from "../../types/canvas"
import localForage from "localforage"
import { zSort } from "lib/util"
import { pipe } from "fp-ts/function"

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
            ...executeCrop(htmlImage, inset),
          } as CanvasItemT
        }
      })
    case "SELECT_ITEM":
      // export const zPop = (draft: Draft<StateT>, topItem: ItemT) => {
      // }

      return pipe(
        state,
        produce((draft) => {
          draft.selectedItems = [action.payload.itemId]
        }),
        produce((draft: Draft<CanvasState>) => {
          const i = draft.items.findIndex(
            (item) => item.id === action.payload.itemId
          )
          if (i !== -1) {
            let j = draft.items.length
            draft.items[i].z = j--
            draft.items.forEach((item, ii) => {
              if (ii === i) return
              item.z = j--
            })
          }
        })
      )
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
        selectedItems: [action.payload.id],
      }
    case "DELETE_SELECTED_ITEMS":
      return produce(state, (draft) => {
        draft.items = draft.items.filter(
          (item) => !draft.selectedItems.includes(item.id)
        )
        draft.selectedItems = []
      })
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
