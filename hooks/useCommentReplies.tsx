import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { PostComment } from '../components'
import { Comment } from '../types/Post'

export const useCommentReplies = (
  comment: Comment,
  initialRepliesShown: number
): {
  repliesShown: number
  setRepliesShown: Dispatch<SetStateAction<number>>
  displayedReplies: JSX.Element[] | undefined
} => {
  // Limit # of replies shown (like the parent comment)
  const [repliesShown, setRepliesShown] = useState(initialRepliesShown)
  // Build array of replies if applicable to this comment:
  const displayedReplies = useMemo(() => {
    if (comment?.replies) {
      // console.log(comment?.replies)
      return comment.replies
        .slice(0, repliesShown)
        .map((reply) => (
          <PostComment
            key={`${reply._key}-${reply.comment.comment}-${reply.comment.postedBy._ref}`}
            commentType={'reply'}
            comment={{ ...reply.comment, _key: reply._key }}
          />
        ))
    }
  }, [comment?.replies, repliesShown])

  return { repliesShown, setRepliesShown, displayedReplies }
}
