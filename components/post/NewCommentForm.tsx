import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { client } from '../../sanity-scripts/client'
import { Post } from '../../types/Post'
import { User } from '../../types/User'
import { StyledButton } from '../'
import { v4 as uuidv4 } from 'uuid'

const NewCommentForm = ({
  postID,
  userID,
}: {
  postID: Post['_id']
  userID: User['_id'] | null
}) => {
  const [textAreaVal, setTextAreaVal] = useState('')

  // queryClient: used to rerender the page with mutated data once a new comment is posted
  const queryClient = useQueryClient()

  const postNewComment = () => {
    if (textAreaVal === '' || textAreaVal.length <= 2) {
      alert(
        'Please type in a comment greater than two characters before submitting!'
      )
      return
    } else {
      console.log('comment submitted as:', textAreaVal)

      client
        .patch(postID) // target the current post
        .setIfMissing({ comments: [] }) // add a comments array if missing from obj
        .insert('after', 'comments[-1]', [
          {
            _key: uuidv4(),
            _type: 'comment',
            comment: textAreaVal,
            postedBy: {
              _type: 'postedBy',
              _ref: userID,
            },
            timeStamp: new Date().toJSON(),
          },
        ]) // insert a new Like at the end of the likes array
        .commit() // commit changes; promise is returned signifying error or success state
        .then((updatedPost) => {
          console.log('Hurray, you commented on this post!')
          queryClient.setQueryData(['postDetails'], updatedPost)
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
          alert(
            `Sorry, we couldn't post your comment at this time. Please try again later. Server response: ${err.message}`
          )
        })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <textarea
        placeholder="Post a comment..."
        className="h-[150px] flex-1 resize-none rounded-xl bg-gray-300 p-2"
        value={textAreaVal}
        onChange={(e) => setTextAreaVal(e.target.value)}
      ></textarea>
      <StyledButton
        disabled={false}
        onClick={postNewComment}
        roundingClass={'rounded-lg'}
      >
        Submit
      </StyledButton>
    </div>
  )
}

export default NewCommentForm
