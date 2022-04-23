import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { User } from '../../types/User'
import { Like, Post } from '../../types/Post'
import { client } from '../../sanity-scripts/client'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from 'react-query'

type Props = {
  posClass?: string
  likes: Like[] | undefined
  userID: User['_id'] | null
  postID: Post['_id']
}

const LikeBtn = ({ userID, postID, likes, posClass = '' }: Props) => {
  // * check if the user has liked the post already (check the likes array against the current user's _id):
  //   * 'undefined' result means that the user hasn't liked the post yet.
  //   * 'Like' result means that the user *has* liked the post already
  const liked = useMemo(() => {
    if (userID && likes)
      return likes.find((like) => like.postedBy._ref === userID)
  }, [likes, userID])

  useEffect(() => {
    console.log('liked var:', liked)
  }, [liked])

  // queryClient: used to rerender the page with mutated data once the like count is updated
  const queryClient = useQueryClient() 

  const onLikeBtnClick = (liked: Like | undefined) => {
    if (!liked) {
      console.log('this post was just liked')
      // * the user just LIKED the post:
      client
        .patch(postID) // target the current post
        .setIfMissing({ likes: [] }) // add a likes array if missing from obj
        .insert('after', 'likes[-1]', [
          {
            _type: 'like',
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: userID,
            },
          },
        ]) // insert a new Like at the end of the likes array
        .commit() // commit changes; promise is returned signifying error or success state
        .then((updatedPost) => {
          console.log('Hurray, you liked this post!')
          queryClient.setQueryData(['postDetails'], updatedPost)
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
        })
    } else {
      console.log('this post was just unliked')
      // * the user just UNLIKED the post
      client
        .patch(postID)
        .unset([`likes[postedBy._ref == "${userID}"]`])
        .commit()
        .then((updatedPost) => {
          console.log('Hurray, your like was removed from the post!')
          queryClient.setQueryData(['postDetails'], updatedPost)
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
        })
    }
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
