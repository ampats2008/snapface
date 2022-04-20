import { Adapter } from 'next-auth/adapters'
import { SanityClient } from '@sanity/client'

const queries_1 = require('./queries')
const uuid_1 = require('@sanity/uuid')
export default function SanityAdapter(
  client: SanityClient,
  options = {
    schemas: {
      account: 'account',
      verificationToken: 'verification-token',
      user: 'user',
    },
  }
): Adapter {
  return {
    async createUser(profile) {
      // create user on sanity db
      const user = await client.create({
        _id: `user-${uuid_1.uuid()}`,
        _type: options.schemas.user,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profileImg: profile.image,
      })

      // return next-auth compatible profile obj
      return {
        id: user._id,
        emailVerified: null,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        image: user.profileImg,
      }
    },
    async getUser(id) {
      const user = await client.fetch(queries_1.getUserByIdQuery, {
        userSchema: options.schemas.user,
        id,
      })
      if (!user) return null
      return {
        id: user._id,
        ...user,
      }
    },
    async linkAccount({
      provider,
      providerAccountId,
      refresh_token,
      access_token,
      expires_at,
      userId,
      type,
    }) {
      await client.create({
        _type: options.schemas.account,
        providerId: provider,
        providerType: type,
        providerAccountId: `${providerAccountId}`,
        refreshToken: refresh_token,
        accessToken: access_token,
        accessTokenExpires: expires_at,
        user: {
          _type: 'reference',
          _ref: userId,
        },
      })
    },
    // using JWT for sessions, not db
    async createSession() {
      return {}
    },
    async updateSession() {
      return {}
    },
    async deleteSession() {},
    async updateUser(user) {
      const { id, firstName, lastName, email, profileImg } = user
      console.log("🚀 ~ file: adapter.ts ~ line 81 ~ updateUser ~ user", user)
      
      const newUser = await client
        .patch(id)
        .set({
          firstName,
          lastName,
          email,
          profileImg,
        })
        .commit()
      return {
        id: newUser._id,
        ...newUser,
        emailVerified: null,
      }
    },
    async getUserByEmail(email) {
      const user = await client.fetch(queries_1.getUserByEmailQuery, {
        userSchema: options.schemas.user,
        email,
      })
      if (!user) return null
      return {
        id: user._id,
        ...user,
      }
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await client.fetch(
        queries_1.getUserByProviderAccountIdQuery,
        {
          accountSchema: options.schemas.account,
          providerId: provider,
          providerAccountId,
        }
      )
      if (!account) return null
      return {
        id: account.user._id,
        emailVerified: null,
        ...account.user,
      }
    },
    async getSessionAndUser() {
      return {}
    },
  }
}
