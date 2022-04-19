import Image from 'next/image'
import { useRouter } from 'next/router'
import { Post } from '../types/Post'
import {buildUrlFor} from '../sanity-scripts/client'

type Props = {
  post: Post
}

const Post = ({ post }: Props) => {
  const router = useRouter()

  const goToPostDetailPage = () => {
    router.push(`/post/${post._id}`)
  } 

  return (
    <div
      id="card"
      className="my-10 mx-3 w-min cursor-pointer rounded-lg drop-shadow-md transition-all ease-out will-change-[filter] hover:scale-[1.05] hover:drop-shadow-2xl sm:m-10"
      onClick={goToPostDetailPage}
    >
      <div id="posterCont" className="relative h-[300px] w-[200px]">
        {post.image ? (
          <Image
            className="rounded-lg"
            layout="fill"
            objectFit="cover"
            src={buildUrlFor(post.image).height(600).width(300).url()}
            alt={`${post.title}`}
            title={`${post.title}`}
            priority
          />
        ) : (
          <div className="absolute top-0 bottom-0 left-0 right-0 grid place-items-center rounded-lg bg-gray-400 dark:bg-gray-600">
            <p className=" m-0 p-0 text-center text-xl font-bold">
              {post.title}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
