import React from "react"
import { applyPatch, createPatch, Patch } from "rfc6902"

const patch: Patch = [
  {
    op: "remove",
    path: "/0",
  },
]

const items = [
  {
    id: "foo",
  },
]
const PatchTest = () => {
  const c = applyPatch(items, patch)
  return (
    <div>
      <pre>{JSON.stringify(patch, null, 2)}</pre>
      <pre>{JSON.stringify({ items }, null, 2)}</pre>
    </div>
  )
}

export default PatchTest
