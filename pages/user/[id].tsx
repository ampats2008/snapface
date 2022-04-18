import type { NextPage } from 'next'
import { useUser } from '../../hooks/useUser'
import { Loading, ProfileBanner, ProfilePostsFilter } from '../../components'
import { useEffect, useState } from 'react'

// Depends on User to be signed in:
const UserProfile: NextPage = () => {
  const [user] = useUser()

  useEffect(() => {
    console.log(user)
  }, [user])

  // Call for posts based on filter value
  const [filter, setFilter] = useState('myPosts')

  if (!user) return <Loading />

  return (
    <main>
      <ProfileBanner {...{ user }} />
      {/* Posts feed with controls for filtering by *liked* and *postedBy* current user */}
      <ProfilePostsFilter {...{setFilter, filter}} />
    </main>
  )
}

export default UserProfile
