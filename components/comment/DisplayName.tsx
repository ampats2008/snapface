import { Session } from '../../types/Session'
import { User } from '../../types/User'
import Link from 'next/link'

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
          ? `/user/${user.hasOwnProperty('_id') ? user._id : user.id}`
          : '#'
      }
    >
      <a className="ml-2 font-medium">{displayName}</a>
    </Link>
  )
}

export default DisplayName
