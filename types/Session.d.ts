export interface Session {
  expires: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    profileImg: string
  }
}
