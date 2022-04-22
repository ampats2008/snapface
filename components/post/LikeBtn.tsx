import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useEffect, useState } from 'react'

type Props = {
  posClass?: string
}

const LikeBtn = ({ posClass = '' }: Props) => {
  const [liked, setLiked] = useState(false)

  const onLikeBtnClick = (liked: boolean) => {
    // TODO: handle posting to Sanity when like button is clicked
    if (!liked) {
      // the user liked the post
      console.log('this post was liked', liked)
    } else {
      // the user unliked the post
      console.log('this post was unliked', liked)
    }
    setLiked((prev) => !prev) // reverse the state of the button (outline vs. filled heart)
  }

  const iconClass = 'h-9 w-9 fill-brand-500'
  return (
    <button
      onClick={(e) => {
        e.stopPropagation() // don't click through to post Image
        onLikeBtnClick(liked)
      }}
      className={`${posClass} text-white transition-all hover:scale-[1.05]`}
    >
      {liked ? (
        <AiFillHeart className={iconClass} />
      ) : (
        <AiOutlineHeart className={iconClass} />
      )}
    </button>
  )
}

export default LikeBtn
