import React, { Dispatch, SetStateAction, useState } from 'react'
import { Comment } from '../../types/Post'
import { StyledButton } from '../'

// commentKey={comment._key}
//             commentBody={comment.comment}
//             {...{ replyParentKey, setEditFormOpened }}

type Props = {
  commentBody: Comment['comment']
  setEditFormOpened: Dispatch<SetStateAction<boolean>>
  handleEditComment: (commentBody: Comment['comment']) => void
}

const EditForm = ({
  commentBody,
  setEditFormOpened,
  handleEditComment,
}: Props) => {
  const [textAreaVal, setTextAreaVal] = useState(commentBody)

  return (
    <div id="replyForm" className="flex items-center justify-between p-4">
      <textarea
        placeholder={`Update your comment here...`}
        className="h-[100px] w-[80%] resize-none rounded-xl bg-gray-200 p-2"
        value={textAreaVal}
        onChange={(e) => setTextAreaVal(e.target.value)}
      ></textarea>
      <div className="flex flex-col items-center gap-2 pl-2">
        <StyledButton
          btnType="btn-secondary"
          disabled={false}
          onClick={() => setEditFormOpened(false)}
          roundingClass={'rounded-full text-sm'}
        >
          Cancel
        </StyledButton>
        <StyledButton
          disabled={false}
          onClick={() => handleEditComment(textAreaVal)}
          roundingClass={'rounded-lg text-sm'}
        >
          Update
        </StyledButton>
      </div>
    </div>
  )
}

export default EditForm
