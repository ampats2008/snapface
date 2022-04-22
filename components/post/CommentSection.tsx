import React, { useState } from 'react'
import { Comment } from '../../types/Post'
import StyledButton from '../StyledButton'
import PostComment from './Comment'

type Props = {
  comments: Comment[]
}

const CommentSection = ({ comments }: Props) => {
  const initialCommentsShown = 3
  const [commentsShown, setCommentsShown] = useState(initialCommentsShown)

  return (
    <aside id="commentSection" className="max-w-screen-sm">
      {comments
        .sort((a, b) => {
          // sort comments by most recent to least recent
          const dateA = new Date(a.timeStamp)
          const dateB = new Date(b.timeStamp)
          return dateB - dateA
        })
        .slice(0, commentsShown)
        .map((comment) => (
          <PostComment
            key={`${comment._key}-${comment.comment}-${comment.postedBy._ref}`}
            {...{ comment }}
          />
        ))}
      <div id="showMoreBtnContainer" className="flex justify-center mt-5">
        {commentsShown < comments.length && (
          <StyledButton
            onClick={() =>
              setCommentsShown((prev) => prev + initialCommentsShown)
            }
            disabled={false}
          >
            Show more comments
          </StyledButton>
        )}
      </div>
    </aside>
  )
}

export default CommentSection
