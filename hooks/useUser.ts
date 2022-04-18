import { useState, useEffect } from 'react'
import { client } from '../sanity-scripts/client'
import { User } from '../types/User'

export const useUser: () => [User | null] = () => {
  const [user, setUser] = useState<User | null>(null)

  // might need to rework this
  // Sign in button doesn't disappear after first time sign in
  // have to refresh first
  useEffect(() => {
    const localUser = localStorage.getItem('user')

    const userInfo =
      localUser !== undefined && localUser !== null
        ? JSON.parse(localUser)
        : localStorage.clear()

    const query = userQuery(userInfo?.googleId)

    client
      .fetch(query)
      .then((data) => setUser(data[0]))
      .catch((err) => console.log(err))
  }, [])

  return [user]
}

// query builder helper
export const userQuery = (userId: string) => {
  const query = `*[_type == 'user' && _id == '${userId}']`
  return query
}
