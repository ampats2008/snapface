import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { useQueryClient } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post, Comment, Reply } from '../types/Post'
import { useGlobalState } from '../store/store'

type Args = {
  commentKey: Comment['_key'] | Reply['_key']
  commentType?: 'comment' | 'reply'
  setEditFormOpened: Dispatch<SetStateAction<boolean>>
}

export const useCommentActions = ({
  commentKey,
  commentType,
  setEditFormOpened,
}: Args) => {
  const { id: postID }: { id: string } = useRouter().query
  const queryClient = useQueryClient()
  const [globalState, globalDispatch] = useGlobalState()

  const handleEditComment = (newCommentBody: Comment['comment']) => {
    console.log(`Updating comment: ${newCommentBody}`)
    globalDispatch({
      type: 'snackLoading',
      payload: { message: 'Updating your comment...', timed: false },
    })
    const targetedCommentRootPath =
      commentType === 'comment'
        ? `comments[_key=="${commentKey}"]`
        : `comments..replies[_key=="${commentKey}"].comment`

    const targetedCommentBody = targetedCommentRootPath + '.comment'
    const targetedCommentTimeStamp = targetedCommentRootPath + '.timeStamp'

    client
      .patch(postID) // target the current post
      .set({ [targetedCommentBody]: newCommentBody }) // update the comment with the new body
      .set({ [targetedCommentTimeStamp]: new Date().toJSON() }) // update the comment with the new body
      .commit() // commit changes; promise is returned signifying error or success state
      .then((updatedPost) => {
        console.log('Hurray, you updated your comment on this post!')
        queryClient.setQueryData(['postDetails'], updatedPost)
        setEditFormOpened(false)
        globalDispatch({
          type: 'snackSuccess',
          payload: { message: 'Your comment was updated.', timed: true },
        })
      })
      .catch((err: any) => {
        console.error('Oh no, the update failed: ', err.message)
        globalDispatch({
          type: 'snackFailure',
          payload: {
            message: `Sorry, we couldn't update your comment at this time. Please try again later.`,
            timed: true,
          },
        })
      })
  }

  const handleDeleteComment = () => {
    console.log(`Deleting comment with _key ${commentKey}`)
    globalDispatch({
      type: 'snackLoading',
      payload: { message: 'Deleting your comment...', timed: false },
    })
    // *: if deleting a reply, scan every comment's replies[] to find the obj to delete
    // *: at scale, this should prob be refactored to include the target *thread's* commentKey as well as the reply's commentKey
    const targetedCommentPath =
      commentType === 'comment'
        ? `comments[_key=="${commentKey}"]`
        : `comments..replies[_key=="${commentKey}"]`

    client
      .patch(postID) // target the current post
      .unset([targetedCommentPath]) // delete comment with corresponding _key
      .commit() // commit changes; promise is returned signifying error or success state
      .then((updatedPost) => {
        console.log('Hurray, you deleted your comment on this post!')
        queryClient.setQueryData(['postDetails'], updatedPost)
        globalDispatch({
          type: 'snackSuccess',
          payload: { message: 'Your comment was deleted.', timed: true },
        })
      })
      .catch((err: any) => {
        console.error('Oh no, the update failed: ', err.message)
        globalDispatch({
          type: 'snackFailure',
          payload: {
            message: `Sorry, we couldn't delete your comment at this time. Please try again later.`,
            timed: true,
          },
        })
      })
  }

  return { handleEditComment, handleDeleteComment }
}
