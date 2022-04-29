import { User } from './User'
import { PostedBy } from './Post'

// type guard User vs. PostedBy
// -- used to check if an object contains the User obj or just a reference to the User obj.
export function isUser(obj: User | PostedBy): obj is User {
  return (obj as User)._id !== undefined
}
