import Error from 'next/error'
import type { NextPage, NextPageContext } from 'next'
import { useUser } from '../../hooks/useUser'
import {
  Feed,
  Loading,
  ProfileBanner,
  ProfilePostsFilter,
} from '../../components'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { client } from '../../sanity-scripts/client'
import { User } from '../../types/User'

// Private version of profile page: requires user to be signed in:
// the public user profile page will be a SSR page that doesn't interface with useUser / useSession
const UserProfile: NextPage<{ initialData: User }> = ({
  initialData: pageUser,
}) => {
  const { data: session, status } = useSession()
  const {
    user: currentUser,
    isLoading,
    isError,
    error,
  } = useUser(session, status) // get the current user using the session.user.id

  // useEffect(() => {
  //   console.log(session)
  // }, [session])
  // TODO: EDIT PROFILE DETAILS:
  // TODO: if the user from useUser matches the user from pageUser, then:
  // TODO: the user is currently logged in and viewing their own profile page.
  // TODO: this means that we should enable the user to edit their profile details and POST them to Sanity.

  // TODO: CREATE NEW POST:
  // TODO: allow the user to create a new post and POST it to Sanity

  // Call for posts based on filter value
  const [filter, setFilter] = useState('myPosts')

  if (status === 'loading' || isLoading) return <Loading />

  if (isError) return <Error statusCode={401} />

  return (
    <main>
      {pageUser && <ProfileBanner {...{ user: pageUser }} />}
      {/* Posts feed with controls for filtering by *liked* and *postedBy* current user */}
      <ProfilePostsFilter {...{ setFilter, filter }} />
      <section className="mb-10">
        <Feed filterBy={filter} userId={pageUser._id} />
      </section>
    </main>
  )
}

export default UserProfile

export async function getServerSideProps(context: NextPageContext) {
  const query = `*[_type == 'user' && _id == '${context.query.id}'][0]`

  const initialData = await client.fetch(query)

  // ?: if this is only being used as prefetch data,
  // ?: do you still need to handle errors?

  return {
    props: {
      initialData,
    },
  }
}
