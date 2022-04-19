import type { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loading, LoggedOutLanding } from '../components'
import { useUser } from '../hooks/useUser'

const Home: NextPage = () => {

  const { isLoading , isLoggedIn } = useUser() // get the current user

  const router = useRouter()

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0,0)
    // localStorage.clear()
  }, [])

  if (isLoading) return <Loading />

  if (isLoggedIn) router.push('/user/welcome')

  return (
    <main className="grid place-content-center min-h-[50vh]">
      {/* display only if not logged in: */}
      <LoggedOutLanding />
    </main>
  )
}

export default Home

