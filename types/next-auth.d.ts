import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    expires: string
    user: {
      /** The user's postal address. */
      id: string
      firstName: string
      lastName: string
      email: string
      profileImg: string
    }
  }
}
