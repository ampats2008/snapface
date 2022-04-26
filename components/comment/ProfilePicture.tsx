import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Session } from '../../types/Session'
import { User } from '../../types/User'

const ProfilePicture = ({
  userLoading,
  user,
  displayName,
  customClickHandler,
}: {
  userLoading: boolean
  user: User | Session['user']
  displayName: string | undefined
  customClickHandler?: React.MouseEventHandler
}) => {
  const router = useRouter()

  const defaultOnClick = () => {
    // redirect to user's profile by default
    router.push(`/user/${user.hasOwnProperty('_id') ? user._id : user.id}`)
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
