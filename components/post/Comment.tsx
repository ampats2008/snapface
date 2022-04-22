import { Comment } from '../../types/Post'
import { usePostedBy } from '../../hooks/usePostedBy'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import StyledButton from '../StyledButton'

const PostComment = ({ comment }: { comment: Comment }) => {
  // Get the user that this comment was postedBy:
  const {
    postedByUser,
    isLoading: userLoading,
    isError,
  } = usePostedBy(comment.postedBy._ref)

  // Calculate what the displayName of this user should be: either userName or their full name
  const displayName = useMemo(() => {
    // Calculate a display name when the user has been fetched
    if (!userLoading && !isError) {
      if (postedByUser.userName) return `@${postedByUser.userName}`
      return `${postedByUser.firstName} ${postedByUser.lastName.slice(0, 1)}.`
    } else if (isError) {
      return 'error fetching user'
    }
  }, [
    userLoading,
    postedByUser?.userName,
    postedByUser?.firstName,
    postedByUser?.lastName,
  ])

  // Replies:
  // Limit # of replies shown (like the parent comment)
  const initialRepliesShown = 3
  const [repliesShown, setRepliesShown] = useState(initialRepliesShown)
  // Build array of replies if applicable to this comment:
  const displayedReplies = useMemo(() => {
    if (comment?.replies) {
      console.log(comment?.replies)
      return comment.replies
        .slice(0, repliesShown)
        .map((reply) => (
          <PostComment
            key={`${reply._key}-${reply.comment.comment}-${reply.comment.postedBy._ref}`}
            comment={reply.comment}
          />
        ))
    }
  }, [comment?.replies, repliesShown])

  // Format timestamp
  const timePosted = new Date(comment.timeStamp)

  return (
    <>
      <div id="comment" className="my-5 rounded-lg bg-gray-100 p-3 shadow-sm">
        <div id="commentHead" className="flex items-center">
          <Link href={!userLoading ? `/user/${postedByUser._id}` : '#'}>
            <a className="h-[40px]">
              <Image
                className="rounded-full"
                height="40"
                width="40"
                src={
                  postedByUser && postedByUser.profileImg
                    ? postedByUser.profileImg
                    : 'https://source.unsplash.com/50x50/?technology'
                }
                alt={`${displayName}'s profile image`}
                title={`${displayName}'s profile image`}
              />
            </a>
          </Link>
          {/* username */}
          <Link href={!userLoading ? `/user/${postedByUser._id}` : '#'}>
            <a className="ml-2 font-medium">{displayName}</a>
          </Link>
          <span className="mx-3 flex-1 text-right text-sm text-gray-500">
            {timePosted.toLocaleDateString('en-US', { dateStyle: 'long' })}
            {' at '}
            {timePosted.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </span>
        </div>
        <p id="commentBody" className="my-2 leading-[1.7]">
          {comment.comment}
        </p>
      </div>
      {displayedReplies && displayedReplies.length > 0 && (
        <div id="repliesContainer" className="ml-auto w-[85%]">
          {comment.replies && comment.replies.length > 0 && (
            <>
              <span className="text-sm text-gray-400">
                {comment.replies.length} replies
              </span>
              <hr className="h-[1px] border-gray-300" />
            </>
          )}
          {displayedReplies}
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

export default PostComment
