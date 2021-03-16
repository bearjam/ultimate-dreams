import React, { HTMLProps, useState } from "react"
import { useForm } from "react-hook-form"
import { insertCanvasTextItemAction } from "../../stores/canvas/actions"
import { useCanvasStore } from "../../stores/canvas"
import Submit from "../inputs/Submit"
import TextInput from "../inputs/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

type Props = HTMLProps<HTMLFormElement>

const schema = z.object({
  text: z.string().nonempty(),
})

const TextForm = (props: Props) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(schema),
  })
  const dispatch = useCanvasStore((store) => store.dispatch)

  async function onSubmit({ text }: { text: string }) {
    console.log(text)
    dispatch(insertCanvasTextItemAction({ text }))
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <TextInput name="text" ref={register} />
      <Submit />
    </form>
  )
}

export default TextForm
