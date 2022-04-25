export interface Post {
  _createdAt: Date
  _id: string
  _rev: string
  _type: string
  _updatedAt: Date
  categories: Category[]
  description: string
  destination: string
  image: Image
  postedBy: PostedBy
  tags: string[]
  title: string
  likes?: Like[]
  comments?: Comment[]
}

export interface Category {
  _key: string
  _ref: string
  _type: string
}

export interface Image {
  _type: string
  asset: PostedBy
}

export interface PostedBy {
  _ref: string
  _type: string
}

export interface Like {
  postedBy: PostedBy
  _key: string
  _type: string
}

export interface Comment {
  comment: string
  postedBy: PostedBy
  timeStamp: Date
  replies: Reply[]
  _key: string
  _type: string
}

export interface Reply {
  comment: Omit<Comment, '_key'>
  _key: string
  _type: string
}
