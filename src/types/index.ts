import { Item } from "./items"
import * as z from "zod"

const modeP = z.enum(["SELECT", "MOVE", "RESIZE", "ROTATE", "CROP"])
type Mode = z.infer<typeof modeP>

export type State = {
  mode: Mode
  items: Item[]
  selectedItems: Item[]
}
