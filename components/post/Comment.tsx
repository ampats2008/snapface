import { Comment, Post } from '../../types/Post'
import { usePostedBy } from '../../hooks/usePostedBy'
import Link from 'next/link'
import Image from 'next/image'
import StyledButton from '../StyledButton'
import { useDisplayName } from '../../hooks/useDisplayName'
import { useCommentReplies } from '../../hooks/useCommentReplies'
import { User } from '../../types/User'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { Session } from '../../types/Session'
import { useCommentActions } from '../../hooks/useCommentActions'
import { MdCancel } from 'react-icons/md'

const PostComment = ({ comment }: { comment: Comment }) => {
  // Get the user that this comment was postedBy:
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

  // Replies:
  const initialRepliesShown = 3
  const { repliesShown, setRepliesShown, displayedReplies } = useCommentReplies(
    comment,
    initialRepliesShown
  )

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
              commentId={comment._key}
              showEditDelete={session.user.id === postedByUser._id}
              {...{ setReplyFormOpened }}
            />
          )}
        </div>
        <p id="commentBody" className="my-2 leading-[1.7]">
          {comment.comment}
        </p>
      </div>
      {replyFormOpened && (
        <NewReplyForm {...{ userLoading, postedByUser, setReplyFormOpened }} />
      )}
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

export default PostComment

const ProfilePicture = ({
  userLoading,
  user,
  displayName,
}: {
  userLoading: boolean
  user: User | Session['user']
  displayName: string | undefined
}) => {
  return (
    <Link
      href={
        !userLoading
          ? `/user/${user.hasOwnProperty('_id') ? user._id : user.id}`
          : '#'
      }
    >
      <a className="h-[40px]">
        <Image
          className="rounded-full"
          height="40"
          width="40"
          src={
            user && user.profileImg
              ? user.profileImg
              : 'https://source.unsplash.com/50x50/?technology'
          }
          alt={`${displayName}'s profile image`}
          title={`${displayName}'s profile image`}
        />
      </a>
    </Link>
  )
}

const DisplayName = ({
  userLoading,
  displayName,
  user,
}: {
  userLoading: boolean
  displayName: string | undefined
  user: User | Session['user']
}) => {
  return (
    <Link
      href={
        !userLoading
          ? `/user/${user.hasOwnProperty('_id') ? user._id : user.id}`
          : '#'
      }
    >
      <a className="ml-2 font-medium">{displayName}</a>
    </Link>
  )
}

const DateTimePosted = ({ timePosted }: { timePosted: Date }) => {
  return (
    <span className="mx-3 flex-1 text-right text-sm text-gray-500">
      {timePosted.toLocaleDateString('en-US', {
        dateStyle: 'long',
      })}
      {' at '}
      {timePosted.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })}
    </span>
  )
}

const ContextMenu = ({
  showEditDelete,
  commentId,
  setReplyFormOpened,
}: {
  showEditDelete: boolean
  commentId: Comment['_key']
  setReplyFormOpened: Dispatch<SetStateAction<boolean>>
}) => {
  const [menuOpened, setMenuOpened] = useState(false)

  const { handleEditComment, handleDeleteComment } = useCommentActions({
    commentId,
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
        </div>
      )}
    </div>
  )
}

const MenuItem = ({
  onClick,
  className,
  children,
}: {
  onClick: React.MouseEventHandler
  className: string
  children: ReactNode
}) => {
  return (
    <div
      onClick={onClick}
      className={`my-[2px] flex w-full cursor-pointer items-center px-3 py-1 first-of-type:mt-0 first-of-type:rounded-t-lg last-of-type:mb-0 last-of-type:rounded-b-lg ${className}`}
    >
      {children}
    </div>
  )
}

const NewReplyForm = ({
  userLoading,
  postedByUser,
  setReplyFormOpened,
}: {
  userLoading: boolean
  postedByUser: User
  setReplyFormOpened: Dispatch<SetStateAction<boolean>>
}) => {
  // get session info
  const { data: session, status }: { data: Session; status: string } =
    useSession()

  const displayName = useDisplayName({
    user: session.user,
    userLoading: status === 'loading',
    userError: false,
  })

  const postReply = () => {
    console.log('Replying to comment')
    // TODO: submit new reply to Sanity; onSuccess: close form using setReplyFormOpened
  }

  return (
    <div
      id="replyDummyComment"
      className="my-5 rounded-[2rem] bg-gray-300 shadow-sm"
    >
      <div
        id="commentHead"
        className="flex items-center rounded-full bg-gray-100 p-2 shadow-sm"
      >
        {status !== 'loading' && (
          <>
            <ProfilePicture
              {...{ userLoading, user: session.user, displayName }}
            />
            <DisplayName
              {...{ userLoading, user: session.user, displayName }}
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
      <div
        id="replyForm"
        className="mt-4 flex items-center justify-between px-4"
      >
        <textarea
          placeholder={`Type your reply here...`}
          className="h-[100px] w-[80%] resize-none rounded-xl bg-gray-300 p-2"
        ></textarea>
        <StyledButton
          disabled={false}
          onClick={postReply}
          roundingClass={'rounded-lg'}
        >
          Reply
        </StyledButton>
      </div>
    </div>
  )
}
