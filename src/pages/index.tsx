import Link from "../components/Link"

const IndexPage = () => {
  return (
    <article>
      <Link href="/explore">
        <a>
          <h2>Explore</h2>
        </a>
      </Link>
      <Link href="/create">
        <a>
          <h2>Create</h2>
        </a>
      </Link>
    </article>
  )
}

export default IndexPage
