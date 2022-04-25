import React from 'react'
import { useCommentReplies } from '../../hooks/useCommentReplies'
import { Comment } from '../../types/Post'
import StyledButton from '../StyledButton'

type Props = {
  comment: Comment
}

const RepliesSection = ({ comment }: Props) => {
  // Get list of PostComment components for replies
  const initialRepliesShown = 3
  const { repliesShown, setRepliesShown, displayedReplies } = useCommentReplies(
    comment,
    initialRepliesShown
  )

  return (
    <>
      {displayedReplies && displayedReplies.length > 0 && (
        <div id="repliesContainer" className="ml-auto w-[85%]">
          {/* REPLY SECTION HEADING */}
          {comment.replies && comment.replies.length > 0 && (
            <>
              <span className="text-sm text-gray-400">
                {comment.replies.length} replies
              </span>
              <hr className="h-[1px] border-gray-300" />
            </>
          )}
          {/* REPLIES */}
          {displayedReplies}
          {/* SHOW MORE REPLIES BUTTON */}
          {repliesShown < comment?.replies.length ? (
            <div
              id="showMoreBtnContainer"
              className="flex justify-center py-2 text-sm"
            >
              <StyledButton
                onClick={() =>
                  setRepliesShown((prev) => prev + initialRepliesShown)
                }
                disabled={false}
                btnType="btn-secondary"
                roundingClass="rounded-full"
              >
                Show more replies
              </StyledButton>
            </div>
          ) : (
            <hr className="h-[1px] border-gray-300" />
          )}
        </div>
      )}
    </>
  )
}

export default RepliesSection
