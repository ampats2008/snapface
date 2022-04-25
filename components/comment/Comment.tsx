import { Comment, Reply } from '../../types/Post'
import { usePostedBy } from '../../hooks/usePostedBy'
import { useDisplayName } from '../../hooks/useDisplayName'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Session } from '../../types/Session'
import {
  ContextMenu,
  DateTimePosted,
  DisplayName,
  NewReplyForm,
  ProfilePicture,
} from '../'
import RepliesSection from './RepliesSection'

type Props = {
  comment: Comment
  commentType?: 'comment' | 'reply'
}

const PostComment = ({ comment, commentType = 'comment' }: Props) => {
  // Get the user that this comment was postedBy:
  // !: this hook could be eliminated by including the '->' operator in the GROQ query for the Post
  const {
    postedByUser,
    isLoading: userLoading,
    isError,
  } = usePostedBy(comment.postedBy._ref)

  // Calculate what the displayName of this user should be: either userName or their full name
  const displayName = useDisplayName({
    user: postedByUser,
    userLoading,
    userError: isError,
  })

  // Format timestamp
  const timePosted = new Date(comment.timeStamp)

  // Conditions for Context-Menu / Actions:
  // 1. if unauthenticated, don't show context menu
  // 2. if authenticated, enable replies to all comments.
  // 3. if authenticated & the session id matches the comment's user id: enable delete / edit buttons.
  const {
    data: session,
    status,
  }: {
    data: Session
    status: 'authenticated' | 'unauthenticated' | 'loading'
  } = useSession()

  const [replyFormOpened, setReplyFormOpened] = useState(false)

  return (
    <>
      <div id="comment" className="my-5 rounded-lg bg-gray-100 p-3 shadow-sm">
        <div id="commentHead" className="flex items-center">
          <ProfilePicture
            {...{ userLoading, user: postedByUser, displayName }}
          />
          <DisplayName {...{ userLoading, user: postedByUser, displayName }} />
          <DateTimePosted {...{ timePosted }} />
          {/* Context menu -- for delete / edit / reply buttons */}
          {status === 'authenticated' && !userLoading && (
            <ContextMenu
              commentKey={comment._key}
              showEditDelete={session.user.id === postedByUser._id}
              showReply={commentType === 'comment'}
              {...{ setReplyFormOpened, commentType }}
            />
          )}
        </div>
        <p id="commentBody" className="my-2 leading-[1.7]">
          {comment.comment}
        </p>
      </div>
      {replyFormOpened && (
        <NewReplyForm commentKey={comment._key} {...{ setReplyFormOpened }} />
      )}
      <RepliesSection {...{ comment }} />
    </>
  )
}

export default PostComment
