import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { GoogleLoginResponse } from 'react-google-login'
import { client } from '../sanity-scripts/client'
import { User } from '../types/User'

export const useUser: () => {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
} = () => {
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter() // used to redirect user if their account could not be found in our DB

  // Get current user from window.localStorage
  const localUser =
    typeof window !== 'undefined' ? localStorage.getItem('user') : undefined

  const userInfo: GoogleLoginResponse | undefined = useMemo(() => {
    // if localUser is defined, parse the string and return it as userInfo, else return undefined.
    if (typeof localUser === 'undefined' || localUser === null) {
      if (typeof window !== 'undefined') localStorage.clear()
      return
    }
    return JSON.parse(localUser)
  }, [localUser]) // only recompute val if localUser changes

  useEffect(() => {
    if (typeof userInfo !== 'undefined' && userInfo !== null) {
      // when userInfo is defined, query Sanity for the user's info.
      const query = userQuery(userInfo?.googleId)

      client
        .fetch(query)
        .then((data) => setUser(data[0]))
        .catch(() => {
          // if user account could not be found, notify the user and redirect them back to the login screen
          alert(
            "Sorry, we couldn't find your account at this time. Please try to sign in again."
          )
          router.replace('/login')
        })
    }
  }, [userInfo])

  const isLoggedIn = typeof userInfo !== 'undefined'

  return { user, isLoading: !user && isLoggedIn ? true : false, isLoggedIn }
}

// query builder helper
export const userQuery = (userId: string) => {
  const query = `*[_type == 'user' && _id == '${userId}']`
  return query
}
