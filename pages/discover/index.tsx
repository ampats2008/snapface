import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Discover: NextPage = () => {
  const [category, setCategory] = useState<string | null>(null)

  useEffect(() => {
    console.log(category)
  }, [category])

  return (
    <main className="py-10 px-4 xl:p-10">
      <h1 className="mb-10 text-4xl font-bold">
        Find something cool to share...
      </h1>
      <div id="dashboard" className="grid-cols-[200px,_1fr] sm:grid">
        <aside className="mb-10">
          <h2 className="mb-4 font-bold">Categories:</h2>
          <Category
            title={'technology'}
            onClick={() => setCategory('technology')}
            isActive={category === 'technology' ? true : false}
          />
          <Category
            title={'nature'}
            onClick={() => setCategory('nature')}
            isActive={category === 'nature' ? true : false}
          />
          <Category
            title={'sports'}
            onClick={() => setCategory('sports')}
            isActive={category === 'sports' ? true : false}
          />
          <Category
            title={'gaming'}
            onClick={() => setCategory('gaming')}
            isActive={category === 'gaming' ? true : false}
          />
          <Category
            title={'art'}
            onClick={() => setCategory('art')}
            isActive={category === 'art' ? true : false}
          />
        </aside>

        {/* feed takes category as prop */}
        <section className="mb-10">
          <h2 className="ml-10 mb-4 font-bold">Feed:</h2>
        </section>
      </div>
    </main>
  )
}

export default Discover

// Category component
const Category = ({
  isActive,
  onClick,
  title,
}: {
  isActive: boolean
  onClick: React.MouseEventHandler
  title: string
}) => {
  const bottomBColor = isActive
    ? 'border-brand-600'
    : 'border-gray-300 hover:border-brand-300'

  return (
    <div
      id="categoryBtn"
      onClick={onClick}
      className={`block cursor-pointer border-b-2 p-4 transition-all xl:border-b-0 xl:border-r-2 ${bottomBColor}`}
    >
      <div
        id="categoryInfoGroup"
        className="mx-auto flex w-max items-center sm:mx-0"
      >
        <Image
          className="rounded-full"
          width={'50px'}
          height={'50px'}
          src={`https://source.unsplash.com/100x100/?${title}`}
        />
        <p className="ml-3 capitalize">{title}</p>
      </div>
    </div>
  )
}
