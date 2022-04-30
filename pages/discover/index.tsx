import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Category, Feed } from '../../components'
import { client } from '../../sanity-scripts/client'

type Props = {
  categories: string[]
}

const Discover: NextPage<Props> = ({ categories }) => {
  const [currCategory, setCurrCategory] = useState<string>('all')

  const { tag }: { tag?: string } = useRouter().query

  useEffect(() => {
    console.log(tag)
  }, [tag])

  return (
    <main className="py-10 px-4 xl:p-10">
      <h1 className="mb-10 text-3xl font-bold">
        {tag
          ? `More posts tagged with: ${tag}`
          : 'Find something cool to share...'}
      </h1>
      <div id="dashboard" className="grid-cols-[200px,_1fr] sm:grid">
        <aside className="mb-10">
          <h2 className="mb-4 font-bold">Categories:</h2>
          {/* will become a map after categories query is made */}
          {categories.sort().map((catName) => (
            <Category
              key={catName}
              title={catName}
              onClick={() =>
                setCurrCategory((prev) => (prev !== catName ? catName : 'all'))
              }
              isActive={currCategory === catName ? true : false}
            />
          ))}
        </aside>

        {/* feed takes category as prop */}
        <section className="mb-10">
          <Feed filterBy={currCategory} tagFilter={tag} />
        </section>
      </div>
    </main>
  )
}

export default Discover

export async function getStaticProps() {
  // get all possible post categories for tabs at build time
  const data: [{ name: string }] = await client.fetch(
    `*[_type == 'category']{name}`
  )

  const categories = data.map((obj: { name: string }) => obj.name)

  return {
    props: {
      categories,
    },
  }
}
