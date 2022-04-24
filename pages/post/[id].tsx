import type { NextPage, NextPageContext } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  CommentSection,
  DestinationLink,
  LikeBtn,
  Loading,
  NewCommentForm,
  OriginalPoster,
  StyledButton,
  Tag,
} from '../../components'
import { usePostDetail } from '../../hooks/userPostDetail'
import { Post } from '../../types/Post'
import Image from 'next/image'
import { buildUrlFor } from '../../sanity-scripts/client'
import { client } from '../../sanity-scripts/client' // for prefetching data from server
import { useSession } from 'next-auth/react'
import { Session } from '../../types/Session'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from 'react-query'
import { User } from '../../types/User'
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
  const {
    data: session,
    status,
  }: {
    data: Session
    status: 'authenticated' | 'unauthenticated' | 'loading'
  } = useSession()

  if (isLoading) return <Loading />

  if (isError || typeof post === 'undefined') return <Error statusCode={401} />

  return (
    <main className="p-10 sm:mx-auto sm:max-w-[90vw] lg:grid lg:grid-cols-2 lg:gap-10 2xl:gap-x-[14rem]">
      <div id="col1">
        <h1 className="mb-5 max-w-screen-md text-3xl font-bold">
          {post.title}
        </h1>

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

        <OriginalPoster postedByUserId={post.postedBy._ref} />

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
        <h1 className="my-4 text-xl  font-semibold">
          Comments ({post.comments?.length ? post.comments?.length : '0'}):
        </h1>
        {status === 'authenticated' && (
          <NewCommentForm postID={post._id} userID={session?.user?.id} />
        )}
        {status === 'unauthenticated' && (
          <p className="">
            Please{' '}
            <Link href={'/login'}>
              <a className="text-brand-600 hover:underline">sign in</a>
            </Link>{' '}
            to post a comment.
          </p>
        )}
        {post.comments && <CommentSection comments={post.comments} />}
      </div>
    </main>
  )
}

export default PostDetails

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
