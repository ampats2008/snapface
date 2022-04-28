import Error from 'next/error'
import type { NextPage } from 'next'
import { useUser } from '../../../hooks/useUser'
import { Loading, EditProfileForm } from '../../../components'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

const UserSettingsPage: NextPage = () => {
  const { data: session, status } = useSession()
  const {
    user: currentUser,
    isLoading,
    isError,
    error,
  } = useUser(session, status) // get the current user using the session.user.id

  useEffect(() => {
    console.log(currentUser)
  }, [currentUser])

  if (status === 'loading' || isLoading) return <Loading />

  if (status === 'unauthenticated' || isError) return <Error statusCode={401} />

  return (
    <main className="py-10 px-4 xl:p-10">
      <EditProfileForm
        {...{ userId: session?.user?.id, initialUserInfo: currentUser }}
      />
    </main>
  )
}

export default UserSettingsPage
