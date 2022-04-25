import { useMemo } from 'react'
import { Session } from '../types/Session'
import { User } from '../types/User'

type Args = {
  userLoading: boolean
  userError: boolean
  user: User | undefined | Session['user']
}

export const useDisplayName = ({ userLoading, userError, user }: Args) => {
  const displayName = useMemo(() => {
    // Calculate a display name when the user has been fetched
    if (!userLoading && !userError && typeof user !== 'undefined') {
      // !: userName doesn't exist on Session['user']
      if (user.userName) return `@${user.userName}`
      return `${user.firstName} ${user.lastName.slice(0, 1)}.`
    } else if (userError) {
      return 'error fetching user'
    }
  }, [userLoading, user?.userName, user?.firstName, user?.lastName])

  return displayName
}
