import Error from 'next/error'
import type { NextPage } from 'next'
import { useUser } from '../../../hooks/useUser'
import { Loading, CreatePostForm } from '../../../components'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { buildUrlFor } from '../../../sanity-scripts/client'

// Private version of profile page: requires user to be signed in:
// the public user profile page will be a SSR page that doesn't interface with useUser / useSession
const CreatePostPage: NextPage = () => {
  const { data: session, status } = useSession()
  const {
    user: currentUser,
    isLoading,
    isError,
    error,
  } = useUser(session, status) // get the current user using the session.user.id

  useEffect(() => {
    console.log(session)
  }, [session])

  // TODO: CREATE NEW POST:
  // TODO: allow the user to create a new post and POST it to Sanity

  if (status === 'loading' || isLoading) return <Loading />

  if (status === 'unauthenticated' || isError) return <Error statusCode={401} />

  return (
    <main className="py-10 px-4 xl:p-10">
      <h1 className="mb-10 text-3xl font-bold">Make a New Post</h1>
      <CreatePostForm {...{ userId: session?.user?.id }} />
    </main>
  )
}

export default CreatePostPage
