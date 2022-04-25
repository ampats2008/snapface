import Error from 'next/error'
import Image from 'next/image'
import { FC, useEffect } from 'react'
import { usePosts } from '../hooks/usePosts'
import { Loading, Post } from './index'

type Props = {
  filterBy?: string
  userId?: string
}

const Feed: FC<Props> = ({ filterBy = 'all', userId }) => {
  // fetch posts to display (with a filter if provided)
  // filters could be:
  //     a category, liked posts by a given user, or created posts by a given user
  const { posts, isLoading, isError } = usePosts(filterBy, userId)

  if (isLoading) return <Loading />

  if (isError) return <Error statusCode={401} /> // replace this with my own error component

  return (
    <div id="postsContainer" className="flex-wrap sm:flex">
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
