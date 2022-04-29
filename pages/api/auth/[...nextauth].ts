import NextAuth, { DefaultSession } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
// import FacebookProvider from "next-auth/providers/facebook"
// import GithubProvider from 'next-auth/providers/github'
// import TwitterProvider from 'next-auth/providers/twitter'
// import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import SanityAdapter from '../../../sanity-scripts/adapter/adapter'
import { client } from '../../../sanity-scripts/client'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains
      
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // the session will last 30 days,
  },
  adapter: SanityAdapter(client),
  theme: {
    colorScheme: 'auto',
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/user/welcome',
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      token.userRole = 'admin'
      console.log('profile:', profile)
      console.log('user:', user)
      // user exists on first sign in of existing account;
      // only user.id and user.email exist on account creation; the rest are undefined
      if (user)
        token = {
          ...token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImg: user.profileImg,
          },
        }
      // profile exists on account creation -- Note: it is provider-specific (Google's may be different than Facebook's)
      if (profile) {
        // assign google profile props to user
        token['user']['firstName'] = token['user']['firstName'] ?? profile.given_name //prettier-ignore
        token['user']['lastName'] = token['user']['lastName'] ?? profile.family_name //prettier-ignore
        token['user']['profileImg'] = token['user']['profileImg'] ?? profile.picture //prettier-ignore
      }
      return token
    },
    async session({ session, token }) {
      // define the piece(s) of the token that are exposed to the front-end
      // when useSession() or getSession() are called
      session.user = token.user
      return session
    },
  },
})
