import produce from "immer"
import { applyPatch, createPatch, Patch } from "rfc6902"
import { assign, createMachine } from "xstate"
import { Item } from "../types/items"

const itemsMachine = createMachine<{
  items: Item[]
  patches: Patch[]
  inversePatches: Patch[]
  patchIndex: number
}>(
  {
    context: {
      items: [],
      patches: [],
      inversePatches: [],
      patchIndex: -1,
    },
    initial: "default",
    states: {
      default: {
        on: {
          INSERT_ITEM: {
            actions: ["insertItem", "generatePatches"],
          },
          DELETE_ITEM: {
            actions: ["deleteItem", "generatePatches"],
          },
          UNDO: {
            actions: ["undo"],
          },
          REDO: {
            actions: ["redo"],
          },
        },
      },
    },
  },
  {
    actions: {
      insertItem: assign((ctx, event) =>
        produce(ctx, (draft) => {
          draft.items.push(event.item)
        })
      ),
      deleteItem: assign((ctx, event) =>
        produce(ctx, (draft) => {
          delete draft.items[
            draft.items.findIndex((item) => item.id === event.item.id)
          ]
        })
      ),
      generatePatches: assign((ctx, _, meta) =>
        produce(ctx, (draft) => {
          const patch = createPatch(meta.state.context.items, ctx.items)
          const inversePatch = createPatch(ctx.items, meta.state.context.items)
          draft.patches.splice(draft.patchIndex + 1)
          draft.patches.push(patch)
          draft.inversePatches.splice(draft.patchIndex + 1)
          draft.inversePatches.push(inversePatch)
          draft.patchIndex += 1
        })
      ),
      undo: assign((ctx) =>
        produce(ctx, (draft) => {
          if (ctx.patchIndex < 0) return
          const patch = ctx.inversePatches[ctx.patchIndex]
          applyPatch(draft.items, patch)
          draft.patchIndex -= 1
        })
      ),
      redo: assign((ctx) =>
        produce(ctx, (draft) => {
          if (ctx.patchIndex >= ctx.patches.length - 1) return
          const patch = ctx.patches[ctx.patchIndex + 1]
          applyPatch(draft.items, patch)
          draft.patchIndex += 1
        })
      ),
    },
  }
)

export default itemsMachine
