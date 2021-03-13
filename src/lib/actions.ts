import { v4 as uuid } from "uuid"
import { InsertItemAction } from "../types/actions"
import { TextItem } from "../types/items"

export const insertTextAction = ({
  id = uuid(),
  text = "hello world",
  width = 100,
  height = 100,
  top = 50,
  left = 50,
}: Partial<Omit<TextItem, "type">>): InsertItemAction => ({
  type: "INSERT_ITEM",
  payload: {
    type: "TEXT",
    id,
    text,
    width,
    height,
    top,
    left,
  },
})
