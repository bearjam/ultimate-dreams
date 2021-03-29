import dynamic from "next/dynamic"
import React from "react"
import { NoopLayout } from "src/layouts"
const HovisApp = dynamic(() => import("components/hovis"), { ssr: false })

const Test = () => <HovisApp />

Test.Layout = NoopLayout

export default Test
