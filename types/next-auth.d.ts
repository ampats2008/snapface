import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
<<<<<<< HEAD
    expires: string
=======
>>>>>>> 1e2370a7a418035b208b735a328b958a1e193c32
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
