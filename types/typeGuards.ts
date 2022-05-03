import { User } from './User'
import { PostedBy } from './Post'
import { Session } from 'next-auth/core/types'
import { JWT } from 'next-auth/jwt'

// type guard User vs. PostedBy
// -- used to check if an object contains the User obj or just a reference to the User obj.
export function isUserNotPostedBy(obj: User | PostedBy): obj is User {
  return (obj as User)._id !== undefined
}

// type guard to differentiate b/w User / Session prop
export function isUserNotSession(obj: User | Session['user']): obj is User {
  return (obj as User)._id !== undefined
}

interface TokenWithUser extends JWT {
  user: Session['user']
}

export function isTokenWithUser(
  obj: JWT | TokenWithUser
): obj is TokenWithUser {
  return (obj as TokenWithUser).user !== undefined
}
