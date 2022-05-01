import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post } from '../types/Post'

export const usePosts: (
  filterBy?: string,
  userId?: string,
  tagFilter?: string
) => {
  posts: Post[]
  isLoading: boolean
  isError: boolean
} = (filterBy, userId, tagFilter) => {
  // onMount: fetch 100 posts with react-query

  // calculate query based on filter
  const query = useMemo(() => {
    let buildingQuery = ''

    // 1. Construct first part of query (with filter if specified)
    if (filterBy === 'myPosts') {
      buildingQuery = `*[_type == 'post' && postedBy._ref == '${userId}' `
    } else if (filterBy === 'myLikedPosts') {
      buildingQuery = `*[_type == 'post' && '${userId}' in likes[].postedBy._ref `
    } else {
      // use no filter if none was found:
      buildingQuery = `*[_type == 'post' `
    }

    // 2. add a Tag filter if it exists
    if (tagFilter) {
      buildingQuery += `&& '${tagFilter}' in tags[] `
    }

    // 3. add the slice and sort pieces to end.
    buildingQuery += `][0...100] | order(_createdAt desc)`

    return buildingQuery
  }, [filterBy, tagFilter])

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery(
    ['discover-posts', filterBy, tagFilter],
    () => client.fetch(query),
    {
      refetchOnWindowFocus: false,
    }
  )

  return { posts, isLoading, isError }
}
