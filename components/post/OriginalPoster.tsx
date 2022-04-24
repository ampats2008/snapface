import { useAnyUserById } from '../../hooks/useAnyUserById'
import { useDisplayName } from '../../hooks/useDisplayName'
import { Post } from '../../types/Post'
import Error from 'next/error'
import Link from 'next/link'
import Image from 'next/image'
import { Loading } from '../'
import { useRouter } from 'next/router'

const OriginalPoster = ({
  postedByUserId,
}: {
  postedByUserId: Post['postedBy']['_ref']
}) => {
  const { user, isLoading, isError } = useAnyUserById(postedByUserId)

  // Calculate what the displayName of this user should be: either userName or their full name
  const displayName = useDisplayName({
    user,
    userLoading: isLoading,
    userError: isError,
  })

  // Handle OP button click
  const router = useRouter()
  const goToProfilePage = () => {
    router.push(`/user/${user?._id}`)
  }

  if (isLoading) return <Loading />

  if (isError || typeof user === 'undefined') return <Error statusCode={401} />

  return (
        <div
          onClick={goToProfilePage}
          id="userNameGroup"
          className="my-5 flex w-max cursor-pointer items-center rounded-full bg-gray-300 py-0 pr-4 transition-colors hover:bg-brand-300"
        >
          <Image
            width="40px"
            height="40px"
            className="inline-block rounded-full border-4 border-white shadow-sm"
            src={
              user.profileImg
                ? user.profileImg
                : 'https://source.unsplash.com/70x70/?nature,photography,technology'
            }
          />
          <p className="ml-3 text-xl text-gray-600">{displayName}</p>
        </div>
  )
}

export default OriginalPoster
