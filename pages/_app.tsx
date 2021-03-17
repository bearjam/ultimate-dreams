import { AppPropsType } from "next/dist/next-server/lib/utils"
import React from "react"
import { Flipper } from "react-flip-toolkit"
import Header from "components/Header"
import "./_app.css"

function MyApp({ Component, pageProps, router }: AppPropsType) {
  return (
    <Flipper flipKey={router.pathname}>
      <Header />
      <Component {...pageProps} />
    </Flipper>
  )
}

export default MyApp
