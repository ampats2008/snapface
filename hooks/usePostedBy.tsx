import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { PostedBy } from '../types/Post'
import { User } from '../types/User'

export const usePostedBy: (_ref: PostedBy["_ref"]) => {
  postedByUser: User
  isLoading: boolean
  isError: boolean
} = (_ref) => {
  //onMount: fetch 100 posts with react-query

  // Make query string to fetch posts:
  // if filterBy has been set (i.e. a category tab has been clicked),
  // include the filter in the query, else leave it blank
  const query = `*[_type == 'user' && _id == '${_ref}'][0]`

  const {
    data: postedByUser,
    isLoading,
    isError,
  } = useQuery(['get-posted-by', _ref], () => client.fetch(query))

  return { postedByUser, isLoading, isError }
}
