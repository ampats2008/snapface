import Error from 'next/error'
import { FC, useEffect, useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { Loading, Post } from './index'
import { Category } from '../types/Post'
import { useScrolledToBottom } from '../hooks/useScrolledToBottom'
import { motion } from 'framer-motion'

type Props = {
  filterByServer?: 'all' | 'myPosts' | 'myLikedPosts'
  filterByClient?: 'all' | Category['_ref']
  tagFilter?: string
  userId?: string
}

const Feed: FC<Props> = ({
  filterByServer = 'all',
  filterByClient = 'all',
  tagFilter,
  userId,
}) => {
  // fetch posts to display (with a server-side filter if provided)
  // filters could be: liked posts by a given user, or created posts by a given user
  const { posts, isLoading, isError } = usePosts(
    filterByServer,
    userId,
    tagFilter
  )

  const postsPerPage = 3
  const [displayedPosts, setDisplayedPosts] = useState(postsPerPage)

  // Infinite Scroll custom hook
  // returns:
  // 1. useCallback fn to set as the target obj's ref attribute
  // 2. boolean var that gets set to true every time the target obj enters the viewport
  const [endOfScrollRef, needMoreItems] = useScrolledToBottom({
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  })

  // reveal more records when user reaches end of post grid, unless all the posts are displayed
  useEffect(() => {
    if (needMoreItems && posts.length > displayedPosts)
      setDisplayedPosts((prev) => prev + postsPerPage)
  }, [needMoreItems])

  if (isLoading) return <Loading />

  if (isError) return <Error statusCode={401} /> // replace this with my own error component

  return (
    <motion.div
      layout
      id="postsContainer"
      className="flex-wrap justify-center sm:flex"
    >
      {posts.length > 0 ? (
        posts
          .filter((post) =>
            filterByClient !== 'all'
              ? // check if any of the categories of a post has the same _id/_ref as filterByClient
                post.categories.some((cat) => cat._ref === filterByClient)
              : true
          )
          .slice(0, displayedPosts)
          .map((post) => (
            <Post
              key={`${post.postedBy._ref}_${post.title}_${post._id}`}
              ref={endOfScrollRef}
              {...{ post }}
            />
          ))
      ) : (
        <p className="mx-auto w-max">No posts found.</p>
      )}
    </motion.div>
  )
}

export default Feed
