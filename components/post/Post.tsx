import Image from 'next/image'
import { buildUrlFor } from '../../sanity-scripts/client'
import { useRouter } from 'next/router'
import { Post } from '../../types/Post'
import { DestinationLink, LikeBtn } from '..'
import { useSession } from 'next-auth/react'
import { Session } from '../../types/Session'

type Props = {
  post: Post
}

const Post = ({ post }: Props) => {
  const router = useRouter()

  const { data: session, status }: { data: Session; status: string } =
    useSession()

  const goToPostDetailPage = () => {
    router.push(`/post/${post._id}`)
  }

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
            className="rounded-lg"
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

        {status === 'authenticated' && (
          <LikeBtn
            posClass={'absolute top-2 right-2 px-2 py-1'}
            likes={post?.likes}
            userID={session.user.id}
            postID={post._id}
          />
        )}
        {post.destination && (
          <DestinationLink
            posClass={'absolute bottom-2 left-2'}
            destinationURL={post.destination}
          />
        )}
      </div>
    </div>
  )
}

export default Post

const AltText = ({ title }: { title: string }) => (
  // displays if post.image could not be found for some reason.
  <div className="absolute top-0 bottom-0 left-0 right-0 grid place-items-center rounded-lg bg-gray-400 dark:bg-gray-600">
    <p className=" m-0 p-0 text-center text-xl font-bold">{title}</p>
  </div>
)
