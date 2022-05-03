import Image from 'next/image'
import { useRouter } from 'next/router'
import { Session } from 'next-auth/core/types'
import { User } from '../../types/User'
import { isUserNotSession } from '../../types/typeGuards'

const ProfilePicture = ({
  user,
  displayName,
  customClickHandler,
}: {
  user: User | Session['user']
  displayName: string | undefined
  customClickHandler?: React.MouseEventHandler
}) => {
  const router = useRouter()

  const defaultOnClick = () => {
    // redirect to user's profile by default -- will use customClickHandler if provided
    router.push(`/user/${isUserNotSession(user) ? user._id : user.id}`)
  }

  return (
    <button
      className="h-[40px]"
      onClick={customClickHandler ? customClickHandler : defaultOnClick}
    >
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
    </button>
  )
}

export default ProfilePicture
