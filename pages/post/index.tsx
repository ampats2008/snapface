import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from '../../components'

// Depends on User to be signed in:
const PostFallback: NextPage = () => {
  // reroute user back to discover page if they accidentally open this page
  const router = useRouter()

  useEffect(() => {
    router.push('/discover')
  }, [])

  return <Loading />
}

export default PostFallback
