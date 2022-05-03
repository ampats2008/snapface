import { MdCancel } from 'react-icons/md'
import { Dispatch, SetStateAction } from 'react'
import { Comment } from '../../types/Post'
import { useSession } from 'next-auth/react'
import { useDisplayName } from '../../hooks/useDisplayName'
import { DateTimePosted, DisplayName, ProfilePicture, StyledButton } from '..'
import { useCommentOrReplyForm } from '../../hooks/useCommentOrReplyForm'
import { useUser } from '../../hooks/useUser'

const NewReplyForm = ({
  setReplyFormOpened,
  commentKey,
}: {
  setReplyFormOpened: Dispatch<SetStateAction<boolean>>
  commentKey: Comment['_key']
}) => {
  // get session info for replyHead
  const { data: session, status } = useSession({ required: true })
  const { user, isLoading, isError } = useUser(session, status) // get the current user using the session.user.id

  const displayName = useDisplayName({
    user: user,
    userLoading: isLoading,
    userError: isError,
  })

  // *Data needed for reply submission:
  // 1. 'current userId' (via useSession)
  // 2. '_key' of comment being replied to
  const {
    textAreaVal,
    setTextAreaVal,
    postCommentOrReply: postNewReply,
  } = useCommentOrReplyForm({
    userID: status === 'authenticated' && session ? session.user.id : null,
    commentKey,
    setReplyFormOpened,
    type: 'reply',
  })

  return (
    <div
      id="replyDummyComment"
      className="my-5 rounded-[2rem] bg-gray-300 shadow-sm"
    >
      <div
        id="replyHead"
        className="flex items-center rounded-full bg-gray-100 p-2 shadow-sm"
      >
        {status !== 'loading' && session && (
          <>
            <ProfilePicture
              {...{
                user: session.user,
                displayName,
              }}
            />
            <DisplayName
              {...{
                userLoading: false,
                user: session.user,
                displayName,
              }}
            />
          </>
        )}
        <DateTimePosted timePosted={new Date()} />
        <button
          title="Cancel reply"
          className="group appearance-none"
          onClick={() => setReplyFormOpened(false)}
        >
          <MdCancel className="ml-2 h-6 w-6 fill-gray-500 group-hover:fill-red-400" />
        </button>
      </div>
      <div id="replyForm" className="flex items-center justify-between p-4">
        <textarea
          placeholder={`Type your reply here...`}
          className="h-[100px] w-[80%] resize-none rounded-xl bg-gray-300 p-2"
          value={textAreaVal}
          onChange={(e) => setTextAreaVal(e.target.value)}
        ></textarea>
        <StyledButton
          disabled={false}
          onClick={postNewReply}
          roundingClass={'rounded-lg'}
        >
          Reply
        </StyledButton>
      </div>
    </div>
  )
}

export default NewReplyForm
