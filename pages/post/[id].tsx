import type { NextPage, NextPageContext } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  CommentSection,
  DestinationLink,
  LikeBtn,
  Loading,
  StyledButton,
  Tag,
} from '../../components'
import { usePostDetail } from '../../hooks/userPostDetail'
import { Post } from '../../types/Post'
import Image from 'next/image'
import { buildUrlFor } from '../../sanity-scripts/client'
import { client } from '../../sanity-scripts/client' // for prefetching data from server
import { useUser } from '../../hooks/useUser'
import { useSession } from 'next-auth/react'
import { Session } from '../../types/Session'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from 'react-query'
import { User } from '../../types/User'
import { useAnyUserById } from '../../hooks/useAnyUserById'
import { useDisplayName } from '../../hooks/useDisplayName'
import Link from 'next/link'

type Props = {
  initialData: Post
}

// Depends on User to be signed in:
const PostDetails: NextPage<Props> = ({ initialData }) => {
  const { id: postID }: { id: string } = useRouter().query

  const { post, isLoading, isError } = usePostDetail(postID, initialData)

  // Session status will determine whether or not the 'logged-in'
  // functionality will be added to this page's components or not
  const { data: session, status }: { data: Session; status: string } =
    useSession()

  if (isLoading) return <Loading />

  if (isError || typeof post === 'undefined') return <Error statusCode={401} />

  return (
    <main className="p-10 sm:mx-auto sm:max-w-[90vw] lg:grid lg:grid-cols-2 lg:gap-10 2xl:gap-x-[14rem]">
      <div id="col1">
        <h1 className="mb-5 max-w-screen-md text-3xl font-bold">
          {post.title}
        </h1>

        <OriginalPoster postedByUserId={post.postedBy._ref} />

        <div className="relative my-5 h-[50vh] max-w-screen-md">
          <Image
            className="rounded-2xl"
            layout="fill"
            objectFit="cover"
            src={buildUrlFor(post.image).url()}
            alt={`${post.title}`}
            title={`${post.title}`}
            priority
          />
          <DestinationLink
            destinationURL={post.destination}
            posClass={'absolute bottom-3 left-3'}
          />

          <div
            id="likeGroup"
            className={`
            absolute top-3 right-3 
            flex w-max items-center rounded-2xl 
            bg-gray-800 bg-opacity-70 p-3
            `}
          >
            {/* desktop like count / btn */}
            <LikeBtn
              likes={post.likes}
              userID={status === 'authenticated' ? session?.user?.id : null}
              {...{ postID }}
            />
            <p className="mx-2 inline text-white">
              {post.likes ? post.likes.length.toLocaleString() : '0'}
            </p>
          </div>
        </div>

        <span className="text-sm text-gray-400">Description:</span>
        <hr className="h-[1px] border-gray-300" />
        <p className="mt-4 mb-14 max-w-screen-sm text-xl leading-[2]">
          {post.description}
        </p>

        <span className="text-sm text-gray-400">Tags:</span>
        <hr className="h-[1px] border-gray-300" />
        <div
          id="tags"
          className="mb-10 flex max-w-screen-sm flex-wrap items-center justify-start gap-2 py-4"
        >
          {post.tags.map((tag) => (
            <Tag key={tag} {...{ tag }} />
          ))}
        </div>
      </div>

      <div id="col2">
        {/* Comment Section */}
        <h1 className="my-4 max-w-screen-sm text-xl  font-semibold">
          Comments ({post.comments?.length ? post.comments?.length : '0'}):
        </h1>
        {status === 'authenticated' && (
          <NewCommentForm postID={post._id} userID={session?.user?.id} />
        )}
        {status === 'unauthenticated' && (
          <p className="">Please sign in to post a comment.</p>
        )}
        {post.comments && <CommentSection comments={post.comments} />}
      </div>
    </main>
  )
}

export default PostDetails

const OriginalPoster = ({
  postedByUserId,
}: {
  postedByUserId: Post['postedBy']['_ref']
}) => {
  const { user, isLoading, isError } = useAnyUserById(postedByUserId)

  // Calculate what the displayName of this user should be: either userName or their full name
  const displayName = useDisplayName({user, userLoading:isLoading, userError:isError})

  if (isLoading) return <Loading />

  if (isError || typeof user === 'undefined') return <Error statusCode={401} />

  return (
    <div id="userNameGroup" className="flex items-center">
      <Image
        width="40px"
        height="40px"
        className="inline-block rounded-full border-4 border-white shadow-sm"
        src={
          user.profileImg
            ? user.profileImg
            : 'https://source.unsplash.com/70x70/?nature,photography,technology'
        }
      />
      <Link href={`/user/${user._id}`}><a className='ml-3 text-xl text-gray-600 hover:text-gray-400'>{displayName}</a></Link>
    </div>
  )
}

const NewCommentForm = ({
  postID,
  userID,
}: {
  postID: Post['_id']
  userID: User['_id'] | null
}) => {
  const [textAreaVal, setTextAreaVal] = useState('')

  // queryClient: used to rerender the page with mutated data once a new comment is posted
  const queryClient = useQueryClient()

  const postNewComment = () => {
    // TODO: add reply POST functionality
    if (textAreaVal === '' || textAreaVal.length <= 2) {
      alert(
        'Please type in a comment greater than two characters before submitting!'
      )
      return
    } else {
      console.log('comment submitted as:', textAreaVal)

      client
        .patch(postID) // target the current post
        .setIfMissing({ comments: [] }) // add a comments array if missing from obj
        .insert('after', 'comments[-1]', [
          {
            _key: uuidv4(),
            _type: 'comment',
            comment: textAreaVal,
            postedBy: {
              _type: 'postedBy',
              _ref: userID,
            },
            timeStamp: new Date().toJSON(),
          },
        ]) // insert a new Like at the end of the likes array
        .commit() // commit changes; promise is returned signifying error or success state
        .then((updatedPost) => {
          console.log('Hurray, you commented on this post!')
          queryClient.setQueryData(['postDetails'], updatedPost)
        })
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message)
          alert(
            `Sorry, we couldn't post your comment at this time. Please try again later. Server response: ${err.message}`
          )
        })
    }
  }

  return (
    <div className="flex max-w-screen-sm items-center gap-4">
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

export async function getServerSideProps(context: NextPageContext) {
  const query = `*[_type == 'post' && _id == '${context.query.id}'][0]`

  const initialData = await client.fetch(query)

  // ?: if this is only being used as prefetch data,
  // ?: do you still need to handle errors?

  return {
    props: {
      initialData,
    },
  }
}
