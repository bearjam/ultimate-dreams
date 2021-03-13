import { AppPropsType } from "next/dist/next-server/lib/utils"
import "./_app.css"

function MyApp({ Component, pageProps }: AppPropsType) {
  return <Component {...pageProps} />
}

export default MyApp
