import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Category, Feed } from '../../components'
import { client } from '../../sanity-scripts/client'
import { motion } from 'framer-motion'

type Props = {
  categories: [{ _id: string; name: string }]
}

const Discover: NextPage<Props> = ({ categories }) => {
  const [activeCatName, setCurrCategory] = useState<string>('all')

  const { tag }: { tag?: string } = useRouter().query

  useEffect(() => {
    console.log(categories)
  }, [categories])

  const categoryNames = useMemo(
    () => categories.map((cat) => cat.name),
    [categories]
  )

  return (
    <main className="py-10 px-4 xl:p-10">
      <h1 className="mb-10 text-3xl font-bold">
        {tag
          ? `More posts tagged with: ${tag}`
          : 'Find something cool to share...'}
      </h1>
      <div id="dashboard" className="grid-cols-[200px,_1fr] sm:grid">
        <motion.aside className="mb-10">
          <h2 className="mb-4 font-bold">Categories:</h2>
          {/* will become a map after categories query is made */}

          {categoryNames.sort().map((catName) => (
            <Category
              key={catName}
              title={catName}
              onClick={() =>
                setCurrCategory((prev) => (prev !== catName ? catName : 'all'))
              }
              isActive={activeCatName === catName ? true : false}
            />
          ))}
        </motion.aside>

        <section className="mb-10">
          <Feed
            filterByClient={
              categories.find((cat) => cat.name === activeCatName)?._id
            }
            tagFilter={tag}
          />
        </section>
      </div>
    </main>
  )
}

export default Discover

export async function getStaticProps() {
  // get all possible post categories for tabs at build time
  const data: [{ name: string }] = await client.fetch(
    `*[_type == 'category']{_id, name}`
  )

  // const categories = data.map((obj: { name: string }) => obj.name)

  return {
    props: {
      categories: data,
    },
  }
}
