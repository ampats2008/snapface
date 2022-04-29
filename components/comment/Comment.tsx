import { Comment, Reply } from '../../types/Post'
import { usePostedBy } from '../../hooks/usePostedBy'
import { useDisplayName } from '../../hooks/useDisplayName'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  ContextMenu,
  DateTimePosted,
  DisplayName,
  EditForm,
  NewReplyForm,
  ProfilePicture,
} from '../'
import RepliesSection from './RepliesSection'
import { useCommentActions } from '../../hooks/useCommentActions'

type Props = {
  comment: Comment
  commentType?: 'comment' | 'reply'
  replyParentKey?: Comment['_key'] | null
}

const PostComment = ({
  comment,
  commentType = 'comment',
  replyParentKey = null,
}: Props) => {
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
  const { data: session, status } = useSession()

  // Logic for Comment CRUD Actions: in 'useCommentActions' and 'useCommentOrReplyForm' hooks
  const [replyFormOpened, setReplyFormOpened] = useState(false)
  const [editFormOpened, setEditFormOpened] = useState(false)
  const { handleDeleteComment, handleEditComment } = useCommentActions({
    commentKey: comment._key,
    commentType,
    setEditFormOpened,
  })

  return (
    <>
      <div id="comment" className="my-5 rounded-lg bg-gray-100 p-3 shadow-sm">
        <div id="commentHead" className="flex items-center">
          <ProfilePicture
            {...{
              user: postedByUser,
              displayName,
            }}
          />
          <DisplayName
            {...{
              userLoading,
              user: postedByUser,
              displayName,
            }}
          />
          <DateTimePosted
            {...{
              timePosted,
            }}
          />
          {/* Context menu -- for delete / edit / reply buttons */}
          {status === 'authenticated' && !userLoading && (
            <ContextMenu
              showEditDelete={session.user.id === postedByUser._id}
              {...{
                setReplyFormOpened,
                setEditFormOpened,
                handleDeleteComment,
              }}
            />
          )}
        </div>
        {!editFormOpened ? (
          <CommentBody commentBody={comment.comment} />
        ) : (
          <EditForm
            commentKey={comment._key}
            commentBody={comment.comment}
            {...{ replyParentKey, setEditFormOpened, handleEditComment }}
          />
        )}
      </div>
      {replyFormOpened && (
        <NewReplyForm
          commentKey={replyParentKey ? replyParentKey : comment._key}
          {...{ setReplyFormOpened }}
        />
      )}
      <RepliesSection {...{ comment }} />
    </>
  )
}

export default PostComment

const CommentBody = ({ commentBody }: { commentBody: Comment['comment'] }) => {
  return (
    <p id="commentBody" className="my-2 leading-[1.7]">
      {commentBody}
    </p>
  )
}
