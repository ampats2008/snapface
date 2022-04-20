import { useState, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Session } from '../types/Session'
import { User } from '../types/User'

export const useUser: (
  session: Session | null,
  status: string
) => {
  user: User | null
  isLoading: boolean
  isError: boolean
  error: any
} = (session, status) => {
  // if session status === authenticated, call for user data from sanity.
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ['getUser', session, status],
    () => client.fetch(userQuery(session.user.id)),
    { enabled: status === 'authenticated' }
  )

  return { user, isLoading, isError, error }
}

// query builder helper
export const userQuery = (userId: string | undefined) => {
  const query = `*[_type == 'user' && _id == '${userId}'][0]`
  return query
}
