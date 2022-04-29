import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { LoggedOutLanding } from '../components'

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  const router = useRouter()

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    console.log('login status:', status)
    if (status === 'authenticated') router.push('/discover')
  }, [status])

  return (
    <main className="grid min-h-[50vh] place-content-center">
      {/* display only if not logged in: */}
      <LoggedOutLanding />
    </main>
  )
}

export default Home
