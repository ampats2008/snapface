import type { NextPage, NextPageContext } from 'next'
import { Feed, ProfileBanner, ProfilePostsFilter } from '../../components'
import { useState } from 'react'
import { client } from '../../sanity-scripts/client'
import { User } from '../../types/User'

// Private version of profile page: requires user to be signed in:
// the public user profile page will be a SSR page that doesn't interface with useUser / useSession
const UserProfile: NextPage<{ initialData: User }> = ({
  initialData: pageUser,
}) => {
  // Call for posts based on filter value
  const [filter, setFilter] = useState<'myPosts' | 'myLikedPosts'>('myPosts')

  return (
    <main className="mt-4 xl:mt-0">
      {pageUser && <ProfileBanner {...{ user: pageUser }} />}
      {/* Posts feed with controls for filtering by *liked* and *postedBy* current user */}
      <ProfilePostsFilter {...{ setFilter, filter }} />
      <section className="mb-10 xl:mx-auto xl:w-[80vw]">
        <Feed filterByServer={filter} userId={pageUser._id} />
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
