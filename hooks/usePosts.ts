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

  // Make query string to fetch posts:
  // if filterBy has been set (i.e. a category tab has been clicked),
  // include the filter in the query, else leave it blank
  const query = `*[_type == 'post' ${
    filterBy !== ''
      ? `&& references(*[_type=="category" && name == '${filterBy}']._id)`
      : ''
  }][0...100] | order(_createdAt desc)`

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery(['discover-posts', filterBy], () => client.fetch(query))

  return { posts, isLoading, isError }
}
