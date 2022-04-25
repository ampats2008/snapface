import { Dispatch, SetStateAction, useState } from 'react'
import { Comment, Reply } from '../../types/Post'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useCommentActions } from '../../hooks/useCommentActions'
import { MenuItem } from '../'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'

type Props = {
  showEditDelete: boolean
  showReply: boolean
  commentKey: Comment['_key'] | Reply['_key']
  commentType?: 'comment' | 'reply'
  setReplyFormOpened: Dispatch<SetStateAction<boolean>>
}

const ContextMenu = ({
  showEditDelete,
  showReply,
  commentKey,
  commentType = 'comment',
  setReplyFormOpened,
}: Props) => {
  const [menuOpened, setMenuOpened] = useState(false)

  const { handleEditComment, handleDeleteComment } = useCommentActions({
    commentKey,
    commentType,
  })

  return (
    <div id="contextMenu" className="relative flex place-content-center">
      {/* OPEN / CLOSE BTN */}
      <button
        onClick={() => setMenuOpened((prev) => !prev)}
        className="group appearance-none"
      >
        <BiDotsHorizontalRounded className="ml-4 h-6 w-6 fill-brand-800 transition-colors group-hover:fill-brand-600" />
      </button>
      {menuOpened && (
        <div
          id="dropdown"
          className="absolute top-7 right-0 rounded-lg bg-white shadow-md"
        >
          {showEditDelete && (
            <>
              <MenuItem
                onClick={() => {
                  setMenuOpened(false)
                  handleEditComment()
                }}
                className="hover:bg-amber-100"
              >
                <AiFillEdit className="mr-2 h-4 w-4 fill-amber-500" />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuOpened(false)
                  handleDeleteComment()
                }}
                className="hover:bg-red-100"
              >
                <AiFillDelete className="mr-2 h-4 w-4 fill-red-500" />
                Delete
              </MenuItem>
            </>
          )}
          {showReply && (
            <MenuItem
              onClick={() => {
                setMenuOpened(false)
                setReplyFormOpened(true)
              }}
              className="hover:bg-blue-100"
            >
              <HiReply className="mr-2 h-4 w-4 fill-blue-500" />
              Reply
            </MenuItem>
          )}
        </div>
      )}
    </div>
  )
}

export default ContextMenu
