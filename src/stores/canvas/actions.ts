import { v4 as uuid } from "uuid"
import { CanvasTextItem, InsertCanvasItemAction } from "../../types/canvas"

export const insertCanvasTextItemAction = ({
  id = uuid(),
  text = "hello world",
  width = 100,
  height = 100,
  top = 50,
  left = 50,
}: Partial<Omit<CanvasTextItem, "type">>): InsertCanvasItemAction => ({
  type: "INSERT",
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
