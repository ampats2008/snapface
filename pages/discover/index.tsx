import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Category, Feed } from '../../components'
import { client } from '../../sanity-scripts/client'

type Props = {
  categories: string[]
}

const Discover: NextPage<Props> = ({ categories }) => {
  const [currCategory, setCurrCategory] = useState<string>()

  return (
    <main className="py-10 px-4 xl:p-10">
      <h1 className="mb-10 text-4xl font-bold">
        Find something cool to share...
      </h1>
      <div id="dashboard" className="grid-cols-[200px,_1fr] sm:grid">
        <aside className="mb-10">
          <h2 className="mb-4 font-bold">Categories:</h2>
          {/* will become a map after categories query is made */}
          {categories.sort().map((catName) => (
            <Category
              key={catName}
              title={catName}
              onClick={() => setCurrCategory(catName)}
              isActive={currCategory === catName ? true : false}
            />
          ))}
        </aside>

        {/* feed takes category as prop */}
        <section className="mb-10">
          <h2 className="ml-10 mb-4 font-bold">Feed:</h2>
          <Feed filterBy={currCategory}/>
        </section>
      </div>
    </main>
  )
}

export default Discover

export async function getStaticProps() {
  // get all possible post categories for tabs at build time
  const data = await client.fetch(`*[_type == 'category']{name}`)

  const categories = data.map((obj: { name: any }) => obj.name)

  return {
    props: {
      categories,
    },
  }
}