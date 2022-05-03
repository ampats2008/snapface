import { User } from '../../types/User'
import Link from 'next/link'
import { Session } from 'next-auth/core/types'
import { isUserNotSession } from '../../types/typeGuards'

const DisplayName = ({
  userLoading,
  displayName,
  user,
}: {
  userLoading: boolean
  displayName: string | undefined
  user: User | Session['user']
}) => {
  return (
    <Link
      href={
        !userLoading
          ? `/user/${isUserNotSession(user) ? user._id : user.id}`
          : '#'
      }
    >
      <a className="ml-2 font-medium">{displayName}</a>
    </Link>
  )
}

export default DisplayName
