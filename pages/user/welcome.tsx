import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loading, UserLanding } from '../../components'
import { useUser } from '../../hooks/useUser'

const UserMenu: NextPage = () => {
  const { user, isLoading, isLoggedIn } = useUser() // get the current user
  
  const router = useRouter()

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0)
    // localStorage.clear()
  }, [])

  if (isLoading) return <Loading />

  if (!isLoggedIn) router.push('/')

  return (
    <main className="grid grid-rows-[25vh_1fr] place-items-center">
      <UserLanding user={user!} />
    </main>
  )
}

export default UserMenu
