import { useState, useEffect } from "react"
import { client } from '../sanity-scripts/client'
import { User } from "../types/User"

export const useUser: () => [User] = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const localUser = localStorage.getItem('user')

    const userInfo =
      localUser !== undefined && localUser !== null
        ? JSON.parse(localUser)
        : localStorage.clear()

    const query = userQuery(userInfo?.googleId)

    client.fetch(query).then((data) => setUser(data[0]))
  }, [])

  const userQuery = (userId: string) => {
    const query = `*[_type == 'user' && _id == '${userId}']`
    return query
  }

  return [user]
}
