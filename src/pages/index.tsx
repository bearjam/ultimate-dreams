import { Fragment } from "react"
import Create from "../components/create"
import Explore from "../components/explore"

const IndexPage = () => {
  return (
    <Fragment>
      <Explore />
      <Create />
    </Fragment>
  )
}

export default IndexPage
