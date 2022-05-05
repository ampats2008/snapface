import Image from 'next/image'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { LoggedOutLanding as LoggedOutLandingContent } from '../components'

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
    <main>
      {/* display only if not logged in: */}
      <LoggedOutLandingContent />
    </main>
  )
}

export default Home
