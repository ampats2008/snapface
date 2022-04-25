import Image from 'next/image'
import Link from 'next/link'
import { Session } from '../../types/Session'
import { User } from '../../types/User'

const ProfilePicture = ({
  userLoading,
  user,
  displayName,
}: {
  userLoading: boolean
  user: User | Session['user']
  displayName: string | undefined
}) => {
  return (
    <Link
      href={
        !userLoading
          ? `/user/${user.hasOwnProperty('_id') ? user._id : user.id}`
          : '#'
      }
    >
      <a className="h-[40px]">
        <Image
          className="rounded-full"
          height="40"
          width="40"
          src={
            user && user.profileImg
              ? user.profileImg
              : 'https://source.unsplash.com/50x50/?technology'
          }
          alt={`${displayName}'s profile image`}
          title={`${displayName}'s profile image`}
        />
      </a>
    </Link>
  )
}

export default ProfilePicture
