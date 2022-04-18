export type User = {
  _createdAt: Date
  _id: string
  _rev: string
  _type: string
  _updatedAt: Date
  email: string
  firstName: string
  lastName: string
  profileImg: string
  bio?: string
  profileBanner?: string // might change this to sanity-image
  userName?: string
}
