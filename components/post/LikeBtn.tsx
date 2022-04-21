import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useState } from 'react'

const LikeBtn = ({ posClass }: { posClass: string }) => {
  const [liked, setLiked] = useState(false)

  const iconClass = 'h-9 w-9 fill-brand-500'
  return (
    <button
      onClick={(e) => {
        e.stopPropagation() // don't click through to post Image
        setLiked((prev) => !prev)
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
