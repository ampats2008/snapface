import Link from 'next/link'

const Tag = ({ tag }: { tag: string }) => {
  return (
    <Link href={`/discover?tag=${tag.toLowerCase()}`}>
      <a>
        <span className="mx-1 w-max cursor-pointer items-center rounded-2xl bg-gray-300 py-2 px-3 text-sm text-gray-600  shadow-sm transition-colors first-of-type:ml-0 hover:bg-brand-300">
          {tag.toLowerCase()}
        </span>
      </a>
    </Link>
  )
}

export default Tag
