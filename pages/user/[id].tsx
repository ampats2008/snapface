import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { LoginButton } from '../../components/login/LoginButton'
import { userQuery, useUser } from '../../hooks/useUser'
import { client } from '../../sanity-scripts/client'

// Depends on User to be signed in:
const UserProfile: NextPage = () => {
  const [user] = useUser()

  if (!user) return <div>Page loading...</div>

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <div className='flex items-center'>
        <Image width="60px" height="60px" className='inline-block' src={user.profileImg} />
        <h1 className="ml-4 text-4xl font-bold inline-block">
          {user.firstName} {user.lastName}
        </h1>
      </div>
    </main>
  )
}

export default UserProfile
