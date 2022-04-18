import type { NextPage } from 'next'
import { LandingContent } from '../components'
import { client } from '../sanity-scripts/client'

const Home: NextPage = () => {
  return (
    <main className="grid min-h-[60vh] place-content-center">
      {/* display only if not logged in: */}
      <LandingContent />
    </main>
  )
}

export default Home
