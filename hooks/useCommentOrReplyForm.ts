import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { client } from '../sanity-scripts/client'
import { v4 as uuidv4 } from 'uuid'
import { Post } from '../types/Post'
import { User } from '../types/User'
import { useRouter } from 'next/router'

type Args = {
  userID: User['_id'] | null
}

export const useCommentOrReplyForm = ({ userID }: Args) => {
  const { id: postID }: { id: string } = useRouter().query
  const [textAreaVal, setTextAreaVal] = useState('')

  // queryClient: used to rerender the page with mutated data once a new comment is posted
  const queryClient = useQueryClient()

  const postCommentOrReply = () => {
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
          setTextAreaVal('')
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
          alert(
            `Sorry, we couldn't post your comment at this time. Please try again later. Server response: ${err.message}`
          )
        })
    }
  }

  return { textAreaVal, setTextAreaVal, postCommentOrReply }
}
