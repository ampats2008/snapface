import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { User } from '../../types/User'
import { Like, Post } from '../../types/Post'
import { useLikeBtn } from '../../hooks/useLikeBtn'

type Props = {
  posClass?: string
  likes?: Like[]
  userID: User['_id'] | null
  postID: Post['_id']
}

const LikeBtn = ({
  userID,
  postID,
  likes,
  posClass = 'absolute top-3 right-3 p-3',
}: Props) => {
  // * check if the user has liked the post already (check the likes array against the current user's _id):
  //   * 'undefined' result means that the user hasn't liked the post yet.
  //   * 'Like' result means that the user *has* liked the post already

  const iconClass = 'h-9 w-9 fill-brand-500'

  const { onLikeBtnClick, liked } = useLikeBtn({ likes, postID, userID })

  return (
    <div
      id="likeGroup"
      className={`
        ${posClass}
        flex w-max items-center rounded-2xl 
        bg-gray-800 bg-opacity-70
      `}
    >
      <button
        onClick={(e) => {
          e.stopPropagation() // don't click through to post Image
          onLikeBtnClick()
        }}
        className={`text-white transition-all hover:scale-[1.05]`}
      >
        {liked ? (
          <AiFillHeart className={iconClass} />
        ) : (
          <AiOutlineHeart className={iconClass} />
        )}
      </button>
      <p className="mx-2 inline text-white">
        {likes // Intl.NumberFormat -- provides abbreviations like 1K or 1M for big like counts
          ? new Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(likes.length)
          : '0'}
      </p>
    </div>
  )
}

export default LikeBtn
