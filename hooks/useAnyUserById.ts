import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { User } from '../types/User'
import { userQuery } from './useUser'

export const useAnyUserById = (
  userID: User['_id'] | undefined,
  initialData?: User
) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User>(
    ['getUserById', userID],
    () => client.fetch(userQuery(userID)),
    { initialData }
  )

  return {
    user,
    isLoading,
    isError,
    error,
  }
}
