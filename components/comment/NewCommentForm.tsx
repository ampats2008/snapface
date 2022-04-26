import { User } from '../../types/User'
import { StyledButton } from '../'
import { useCommentOrReplyForm } from '../../hooks/useCommentOrReplyForm'

const NewCommentForm = ({ userID }: { userID: User['_id'] | null }) => {
  const {
    textAreaVal,
    setTextAreaVal,
    postCommentOrReply: postNewComment,
  } = useCommentOrReplyForm({ userID, type: 'comment' })

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
