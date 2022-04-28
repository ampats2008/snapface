import { Asset } from './Post'

export interface User {
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
  bannerImg?: {
    _type: 'image'
    asset: Asset
  }
  userName?: string
}
