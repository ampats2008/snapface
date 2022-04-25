import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post, Comment, Reply } from '../types/Post'

type Args = {
  commentKey: Comment['_key'] | Reply['_key']
  commentType?: 'comment' | 'reply'
}

export const useCommentActions = ({ commentKey, commentType }: Args) => {
  const { id: postID }: { id: string } = useRouter().query
  const queryClient = useQueryClient()

  const handleEditComment = () => {
    console.log('Editing comment')
    // TODO: make the comment <p> 'contentEditable' and allow the user to resubmit the edited comment with a checkmark-btn.
  }

  const handleDeleteComment = () => {
    console.log(`Deleting comment with _key ${commentKey}`)
    // TODO: remove the selected comment from the db.
    client
      .patch(postID) // target the current post
      .unset(
        commentType === 'comment'
          ? [`comments[_key=="${commentKey}"]`]
          : [`comments..replies[_key=="${commentKey}"]`] // *: if deleting a reply, scan every comment's replies[] to find the obj to delete; at scale, this should prob be refactored to include the target *thread's* commentKey as well as the reply's commentKey
      ) // delete comment with corresponding _key
      .commit() // commit changes; promise is returned signifying error or success state
      .then((updatedPost) => {
        console.log('Hurray, you deleted your comment on this post!')
        queryClient.setQueryData(['postDetails'], updatedPost)
      })
      .catch((err: any) => {
        console.error('Oh no, the update failed: ', err.message)
        alert(
          `Sorry, we couldn't post your comment at this time. Please try again later. Server response: ${err.message}`
        )
      })
  }

  return { handleEditComment, handleDeleteComment }
}
