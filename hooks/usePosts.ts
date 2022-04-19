import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post } from '../types/Post'

export const usePosts: (filterBy: string) => {
  posts: Post[]
  isLoading: boolean
  isError: boolean
} = (filterBy) => {
  //onMount: fetch 100 posts with react-query
  const query = `*[_type == 'post'][0...100]`
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery('discover-posts', () => client.fetch(query))

  return { posts, isLoading, isError }
}
