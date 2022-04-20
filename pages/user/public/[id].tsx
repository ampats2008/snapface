import Error from 'next/error'
import type { NextPage } from 'next'
import { useUser } from '../../../hooks/useUser'
import { Loading, ProfileBanner, ProfilePostsFilter } from '../../../components'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

// Public version of profile page: a SSR page that doesn't interface with useUser / useSession
const UserProfile: NextPage = () => {
  const {data: session, status} = useSession()
  const { user, isLoading, isError, error } = useUser(session, status) // get the current user using the session.user.id

  useEffect(() => {
    console.log(session)
  }, [session])

  // Call for posts based on filter value
  const [filter, setFilter] = useState('myPosts')

  if (status === 'loading' || isLoading) return <Loading />

  if (isError) return <Error statusCode={error} />

  return (
    <main>
      {(user) && <ProfileBanner {...{user}} />}
      {/* Posts feed with controls for filtering by *liked* and *postedBy* current user */}
      <ProfilePostsFilter {...{setFilter, filter}} />
    </main>
  )
}

export default UserProfile
