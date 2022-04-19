import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Loading, UserLanding } from '../../components'
import { useUser } from '../../hooks/useUser'

const UserMenu: NextPage = () => {
  
  const { user, isLoading , isLoggedIn } = useUser() // get the current user

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0,0)
    // localStorage.clear()
  }, [])

  if (isLoading) return <Loading />

  return (
    <main className="grid grid-rows-[25vh_1fr] place-items-center">
      {/* display only if not logged in: */}
      <UserLanding user={user!} />
    </main>
  )
}

export default UserMenu