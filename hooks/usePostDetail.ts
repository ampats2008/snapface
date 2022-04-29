import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post } from '../types/Post'

export const usePostDetail: (
  postId: string,
  initialData: Post
) => {
  post: Post | undefined
  isLoading: boolean
  isError: boolean
} = (postId, initialData) => {
  // Make query string to fetch posts:
  // if filterBy has been set (i.e. a category tab has been clicked),
  // include the filter in the query, else leave it blank
  const query = `*[_type == 'post' && _id == '${postId}'][0]`

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post>(['postDetails'], () => client.fetch(query), {
    initialData,
    refetchOnWindowFocus: false,
  })

  return { post, isLoading, isError }
}
