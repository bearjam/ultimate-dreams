import { useMachine } from "@xstate/react"
import Head from "next/head"
import { Fragment } from "react"
import itemsMachine from "../machines/items"

export default function Home() {
  const [{ context }, send] = useMachine(itemsMachine)
  const insertItem = () => {
    send({
      type: "INSERT_ITEM",
      item: {
        id: "foo",
      },
    })
  }
  return (
    <Fragment>
      <button onClick={insertItem}>insert item</button>
      <button onClick={() => void send("UNDO")}>undo</button>
      <button onClick={() => void send("REDO")}>redo</button>
      <pre>{JSON.stringify(context, null, 2)}</pre>
    </Fragment>
  )
}
