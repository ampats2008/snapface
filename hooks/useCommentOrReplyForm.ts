import { Dispatch, SetStateAction, useState } from 'react'
import { useQueryClient } from 'react-query'
import { client } from '../sanity-scripts/client'
import { v4 as uuidv4 } from 'uuid'
import { Comment, Post } from '../types/Post'
import { User } from '../types/User'
import { useRouter } from 'next/router'

type Args = {
  userID: User['_id'] | null
  type: 'comment' | 'reply'
  commentKey?: Comment['_key']
  setReplyFormOpened?: Dispatch<SetStateAction<boolean>>
}

export const useCommentOrReplyForm = ({
  userID,
  commentKey,
  type,
  setReplyFormOpened,
}: Args) => {
  const { id: postID }: { id: string } = useRouter().query
  const [textAreaVal, setTextAreaVal] = useState('')

  // queryClient: used to rerender the page with mutated data once a new comment is posted
  const queryClient = useQueryClient()

  const postCommentOrReply = () => {
    // Guard clause: don't do anything if the comment isn't long enough
    if (textAreaVal === '' || textAreaVal.length <= 2) {
      alert(
        'Please type in a comment greater than two characters before submitting!'
      )
      return
    } else {
      if (type === 'comment') {
        // submit as new comment
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
          ]) // insert a new comment at the end of the comments array
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
      } else if (type === 'reply' && commentKey && setReplyFormOpened) {
        // JSONMatch string to target the replies array of the given comment
        const replies = `comments[_key=="${commentKey}"].replies`
        // submit as new reply to a comment
        client
          .patch(postID) // target the current post
          .setIfMissing({ [replies]: [] }) // add a relpies array if missing from obj
          .append(replies, [
            {
              _key: uuidv4(),
              _type: 'reply',
              comment: {
                _type: 'comment',
                comment: textAreaVal,
                postedBy: {
                  _type: 'postedBy',
                  _ref: userID,
                },
                timeStamp: new Date().toJSON(),
              },
            },
          ]) // insert a new comment at the end of the comments array
          .commit() // commit changes; promise is returned signifying error or success state
          .then((updatedPost) => {
            console.log('Hurray, you commented on this post!')
            queryClient.setQueryData(['postDetails'], updatedPost)
            setTextAreaVal('')
            setReplyFormOpened(false)
          })
          .catch((err) => {
            console.error('Oh no, the update failed: ', err.message)
            alert(
              `Sorry, we couldn't post your comment at this time. Please try again later. Server response: ${err.message}`
            )
          })
      } else {
        console.error(
          `You must specify a comment type for this submit handler! 
            If this is for a reply, you also need to specify the (1) the key of the comment being replied to, and (2) the setState Fn that hides the reply form after a successful POST`
        )
      }
      console.log('comment submitted as:', textAreaVal)
    }
  }

  return { textAreaVal, setTextAreaVal, postCommentOrReply }
}
