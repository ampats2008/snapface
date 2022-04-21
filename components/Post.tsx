import Image from 'next/image'
import { useRouter } from 'next/router'
import { Post } from '../types/Post'
import { buildUrlFor } from '../sanity-scripts/client'
import { FiExternalLink } from 'react-icons/fi'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useState } from 'react'

type Props = {
  post: Post
}

const Post = ({ post }: Props) => {
  const router = useRouter()

  const goToPostDetailPage = () => {
    router.push(`/post/${post._id}`)
  }

  // TODO: transform post.destination to remove 'http://www.' or 'https://www.'
  // * current solution only handles .com domains:
  const destinationFormatted = post.destination.slice(
    post.destination.indexOf('.') + 1,
    post.destination.indexOf('com') + 3
  )

  return (
    <div
      id="cardContainer"
      className={`my-10 mx-3 w-min rounded-lg bg-white drop-shadow-md transition-all ease-out will-change-[filter] hover:-translate-y-2 hover:drop-shadow-2xl sm:m-10`}
    >
      <div
        id="cardContent"
        onClick={goToPostDetailPage}
        className="relative h-[375px] w-[250px] cursor-pointer"
      >
        {post.image ? (
          <Image
            className="rounded-t-lg"
            layout="fill"
            objectFit="cover"
            src={buildUrlFor(post.image).height(600).width(400).url()}
            alt={`${post.title}`}
            title={`${post.title}`}
            priority
          />
        ) : (
          <AltText title={post.title} />
        )}

        <LikeBtn />

        <DestinationLink
          posClass={'absolute bottom-4 left-3'}
          destinationURL={post.destination}
          {...{ destinationFormatted }}
        />
      </div>

      <p className="p-3">{post.title}</p>
    </div>
  )
}

export default Post

const LikeBtn = () => {

  const [liked, setLiked] = useState(false)
  const iconClass = "h-9 w-9 fill-brand-500"
  return (
    <button onClick={(e) => {
      e.stopPropagation() // don't click through to post
      setLiked(prev => !prev)
      }} className="absolute top-2 right-2 text-white">
      {liked ? (
        <AiFillHeart className={iconClass} />
      ) : (
        <AiOutlineHeart className={iconClass} />
      )}
    </button>
  )
}

const DestinationLink = ({
  destinationURL,
  destinationFormatted,
  posClass,
}: {
  destinationURL: string
  destinationFormatted: string
  posClass: string
}) => (
  <a
    href={destinationURL}
    target={'_blank'}
    rel="noreferrer"
    className={`
    ${posClass} 
    flex w-max items-center rounded-full bg-gray-800 bg-opacity-70 py-2
    px-3 text-sm text-white drop-shadow-md
    transition-colors hover:bg-gray-600
    `}
  >
    {destinationFormatted.slice(0, 12)}
    {destinationFormatted.length > 12 && '...'}
    <FiExternalLink className="ml-2 inline-block h-4 w-4" />
  </a>
)

const AltText = ({ title }: { title: string }) => (
  // displays if post.image could not be found for some reason.
  <div className="absolute top-0 bottom-0 left-0 right-0 grid place-items-center rounded-lg bg-gray-400 dark:bg-gray-600">
    <p className=" m-0 p-0 text-center text-xl font-bold">{title}</p>
  </div>
)
