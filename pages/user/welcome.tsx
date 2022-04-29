import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Error from 'next/error'
import { useEffect } from 'react'
import { Loading, UserLanding } from '../../components'
import { useUser } from '../../hooks/useUser'

const UserMenu: NextPage = () => {
  const { data: session, status } = useSession({ required: true })
  const { user, isLoading, isError } = useUser(session, status) // get the current user using the session.user.id

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0)
    console.log(session)
  }, [])

  if (status === 'loading' || isLoading) return <Loading />

  if (isError) return <Error statusCode={401} />

  return (
    <main className="grid grid-rows-[25vh_1fr] place-items-center">
      {user && <UserLanding {...{ user }} />}
    </main>
  )
}

export default UserMenu
