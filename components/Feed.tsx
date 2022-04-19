import { FC } from "react"

type Props = {
    filterBy?: string
}

const Feed : FC<Props> = ({filterBy  = 'all'}) => {

    // fetch posts to display (with a filter if provided)
    // filters could be: 
    //     a category, liked posts by a given user, or created posts by a given user
    // const {posts, isLoading, isError} = usePosts(filterBy)

  return (
    <div>{filterBy}</div>
  )
}

export default Feed