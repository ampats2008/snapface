import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post } from '../types/Post'

export const usePosts: (
  filterBy: string,
  userId?: string
) => {
  posts: Post[]
  isLoading: boolean
  isError: boolean
} = (filterBy, userId) => {
  //onMount: fetch 100 posts with react-query

  // calculate query based on filter
  const query = useMemo(() => {
    if (filterBy === '')
      return `*[_type == 'post'][0...100] | order(_createdAt desc)`

    if (filterBy === 'myPosts') {
      console.log('fetching my posts')
      return `*[_type == 'post' && postedBy._ref == '${userId}'][0...100] | order(_createdAt desc)`
    } else if (filterBy === 'myLikedPosts') {
      console.log('fetching my liked posts')
      return `*[_type == 'post' && '${userId}' in likes[].postedBy._ref][0...100] | order(_createdAt desc)`
    } else {
      // filterBy must be a category name in this case:
      return `*[_type == 'post' && references(*[_type=="category" && name == '${filterBy}']._id)][0...100] | order(_createdAt desc)`
    }
  }, [filterBy])

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery(['discover-posts', filterBy], () => client.fetch(query), {
    refetchOnWindowFocus: false,
  })

  return { posts, isLoading, isError }
}
