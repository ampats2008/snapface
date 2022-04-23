import Error from 'next/error'
import Image from 'next/image'
import { FC } from 'react'
import { usePosts } from '../hooks/usePosts'
import { Loading, Post } from './index'

type Props = {
  filterBy?: string
}

const Feed: FC<Props> = ({ filterBy = 'all' }) => {
  // fetch posts to display (with a filter if provided)
  // filters could be:
  //     a category, liked posts by a given user, or created posts by a given user
  const { posts, isLoading, isError } = usePosts(filterBy)

  if (isLoading) return <Loading />

  if (isError) return <Error statusCode={401} /> // replace this with my own error component

  // console.log(posts)

  return (
    <div id="postsContainer" className="">
      {posts.map((post) => (
        <Post
          key={`${post.postedBy._ref}_${post.title}_${post._id}`}
          {...{ post }}
        />
      ))}
    </div>
  )
}

export default Feed
