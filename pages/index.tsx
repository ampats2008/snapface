import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loading, LoggedOutLanding } from '../components'
import { useUser } from '../hooks/useUser'

const Home: NextPage = () => {

  const {data: session, status} = useSession()

  const router = useRouter()

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0,0)
  }, [])

  useEffect(() => {
    console.log('login status:', status);
    if (status === 'authenticated') router.push('/user/welcome')
  }, [status])

  return (
    <main className="grid place-content-center min-h-[50vh]">
      {/* display only if not logged in: */}
      <LoggedOutLanding />
    </main>
  )
}

export default Home

