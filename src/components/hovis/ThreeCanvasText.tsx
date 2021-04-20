import React from "react"
import { Text } from "@react-three/drei"
import { CanvasTextItem } from "types/canvas"
import { CanvasProps } from "./CanvasCommon"

type Props = {
  item: CanvasTextItem
} & CanvasProps

const ThreeCanvasText = ({ item }: Props) => {
  return <Text>{item.text}</Text>
}

export default ThreeCanvasText
