import type { NextPage, NextPageContext } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import {
  CommentSection,
  DestinationLink,
  LikeBtn,
  Loading,
  NewCommentForm,
  OriginalPoster,
  Tag,
} from '../../components'
import { usePostDetail } from '../../hooks/usePostDetail'
import { Post } from '../../types/Post'
import Image from 'next/image'
import { buildUrlFor } from '../../sanity-scripts/client'
import { client } from '../../sanity-scripts/client' // for prefetching data from server
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
type Props = {
  initialData: Post
}

// Depends on User to be signed in:
const PostDetails: NextPage<Props> = ({ initialData }) => {
  const { id }: ParsedUrlQuery = useRouter().query
  const postID = Array.isArray(id) ? id[0] : id !== undefined ? id : '' // make sure id is a string and defined, else set it to an empty string

  const { post, isLoading, isError } = usePostDetail(postID, initialData)

  console.log(post)

  // Session status will determine whether or not the 'logged-in'
  // functionality will be added to this page's components or not
  const { data: session, status } = useSession()

  if (isLoading) return <Loading />

  if (isError || typeof post === 'undefined') return <Error statusCode={401} />

  return (
    <>
      <main className="p-10 sm:mx-auto sm:max-w-[90vw] lg:grid lg:grid-cols-2 lg:gap-10 2xl:gap-x-[14rem]">
        <div id="col1">
          <h1 className="mb-5 max-w-screen-md text-3xl font-bold">
            {post.title}
          </h1>
          <div className="relative my-5 h-[50vh] max-w-screen-md">
            <Image
              key={post.image.asset._ref}
              className="rounded-2xl"
              layout="fill"
              objectFit="cover"
              src={buildUrlFor(post.image).url()}
              alt={`${post.title}`}
              title={`${post.title}`}
              priority
            />
            {post.destination && (
              <DestinationLink
                destinationURL={post.destination}
                posClass={'absolute bottom-3 left-3'}
              />
            )}
            <LikeBtn
              likes={post.likes}
              userID={
                status === 'authenticated' && session ? session?.user?.id : null
              }
              {...{ postID }}
            />
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
            className="mb-10 flex max-w-screen-sm flex-wrap items-center justify-start gap-y-6 gap-x-2 py-4"
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
          {status === 'authenticated' && session && (
            <NewCommentForm userID={session?.user?.id} />
          )}
          {status === 'unauthenticated' && (
            <p>
              Please{' '}
              <Link href={'/auth/signin'}>
                <a className="text-brand-600 hover:underline">sign in</a>
              </Link>{' '}
              to post a comment.
            </p>
          )}
          {post.comments && <CommentSection comments={post.comments} />}
        </div>
      </main>
    </>
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
