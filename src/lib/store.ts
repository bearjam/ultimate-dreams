import { undoableReducer } from "@bearjam/tom"
import produce from "immer"
import create from "zustand"
import { State } from "../types"
import { Action } from "../types/actions"

const initialState: State = {
  mode: "SELECT",
  items: {},
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INSERT_ITEM":
      return produce(state, (draft) => {
        draft.items[action.payload.id] = action.payload
      })
    case "DELETE_ITEM":
      return produce(state, (draft) => {
        delete draft.items[action.payload.id]
      })
    case "DELETE_ALL_ITEMS":
      return { items: {}, mode: state.mode }
    default:
      return state
  }
}

export const useStore = create(undoableReducer(reducer, initialState))
