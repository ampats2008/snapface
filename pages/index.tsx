import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { LandingContent, UserLanding} from '../components'
import { useUser } from '../hooks/useUser'

const Home: NextPage = () => {
  
  const [user] = useUser() // get the current user

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0,0)
  }, [])

  return (
    <main className="grid min-h-[60vh] place-content-center">
      {/* display only if not logged in: */}
      {!(user) ?
      <LandingContent /> :
      <UserLanding {...{user}} />}
    </main>
  )
}

export default Home

