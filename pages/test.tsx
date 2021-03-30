import dynamic from "next/dynamic"
import React from "react"
import { NoopLayout } from "src/layouts"
const TestApp = dynamic(() => import("components/TestApp"), { ssr: false })

const Test = () => <TestApp />

Test.Layout = NoopLayout

export default Test
