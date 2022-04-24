import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import { client } from '../sanity-scripts/client'
import { Post, Comment } from '../types/Post'

export const useCommentActions = ({
  commentId,
}: {
  commentId: Comment['_key']
}) => {
  const { id: postID }: { id: string } = useRouter().query
  const queryClient = useQueryClient()

  const handleEditComment = () => {
    console.log('Dditing comment')
    // TODO: make the comment <p> 'contentEditable' and allow the user to resubmit the edited comment with a checkmark-btn.
  }

  const handleDeleteComment = () => {
    console.log('Deleting comment')
    // TODO: remove the selected comment from the db.
    client
      .patch(postID) // target the current post
      .unset([`comments[_key=="${commentId}"]`]) // delete comment with corresponding _key
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
