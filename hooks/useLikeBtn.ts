import { QueryClient, useQueryClient } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Like, Post } from '../types/Post'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../types/User'
import { useEffect, useMemo } from 'react'
import { SanityDocument } from '@sanity/client'
import { useGlobalState } from '../store/store'

type Args = {
  likes?: Like[]
  postID: Post['_id']
  userID: User['_id'] | null
}

export const useLikeBtn = ({ likes, postID, userID }: Args) => {
  const liked = useMemo(() => {
    if (userID && likes)
      return likes.find((like) => like.postedBy._ref === userID)
  }, [likes, userID])

  useEffect(() => {
    console.log('liked var:', liked)
  }, [liked])

  const queryClient = useQueryClient() // queryClient: used to rerender the page with mutated data once the like count is updated
  const [globalState, globalDispatch] = useGlobalState()

  const onLikeBtnClick = () => {
    if (!liked) {
      console.log('this post was just liked')
      // * the user just LIKED the post:
      globalDispatch({
        type: 'snackLoading',
        payload: { message: 'Liking this post...' },
      })
      client
        .patch(postID) // target the current post
        .setIfMissing({ likes: [] }) // add a likes array if missing from obj
        .insert('after', 'likes[-1]', [
          {
            _type: 'like',
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: userID,
            },
          },
        ]) // insert a new Like at the end of the likes array
        .commit() // commit changes; promise is returned signifying error or success state
        .then((updatedPost) => {
          console.log('Hurray, you liked this post!')
          mutateQueriesData(queryClient, updatedPost)
          globalDispatch({
            type: 'snackSuccess',
            payload: { message: 'You liked the post.', duration: 3 },
          })
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
          globalDispatch({
            type: 'snackFailure',
            payload: {
              message: `Sorry, we couldn't like the post at this time. Please try again later.`,
              duration: 3,
            },
          })
        })
    } else {
      console.log('this post was just unliked')
      // * the user just UNLIKED the post
      globalDispatch({
        type: 'snackLoading',
        payload: {
          message: 'Removing your like from this post...',
        },
      })
      client
        .patch(postID)
        .unset([`likes[postedBy._ref == "${userID}"]`])
        .commit()
        .then((updatedPost) => {
          console.log('Hurray, your like was removed from the post!')
          mutateQueriesData(queryClient, updatedPost)
          globalDispatch({
            type: 'snackSuccess',
            payload: { message: 'You unliked the post.', duration: 3 },
          })
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
          globalDispatch({
            type: 'snackFailure',
            payload: {
              message: `Sorry, we couldn't unlike the post at this time. Please try again later.`,
              duration: 3,
            },
          })
        })
    }
  }

  return { liked, onLikeBtnClick }
}
function mutateQueriesData(
  queryClient: QueryClient,
  updatedPost: SanityDocument<any>
) {
  queryClient.setQueryData(['postDetails'], updatedPost) // update data on post/[id].tsx page
  queryClient.setQueriesData(['discover-posts'], (oldPosts) => {
    console.log('old posts array', oldPosts)
    if (Array.isArray(oldPosts)) {
      return oldPosts.map((oldPost) =>
        updatedPost._id === oldPost._id ? updatedPost : oldPost
      )
    }
  }) // update data on discover/index.tsx page
}
