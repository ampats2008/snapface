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

type Props = {
  initialData: Post
}

// Depends on User to be signed in:
const PostDetails: NextPage<Props> = ({ initialData }) => {
  const { id: postID } = useRouter().query

  const { post, isLoading, isError } = usePostDetail(postID, initialData)

  if (isLoading) return <Loading />

  if (isError) return <Error statusCode={401} />

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
            w-max items-center rounded-2xl bg-gray-800 
            bg-opacity-70 p-3 flex
            `}
          >
            {/* desktop like count / btn */}
            <LikeBtn />
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
        <NewCommentForm />
        {post.comments && <CommentSection comments={post.comments} />}
      </div>
    </main>
  )
}

export default PostDetails

const NewCommentForm = () => {
  const postNewComment = () => {
    // TODO: post new comment to sanity
    console.log('comment posted')
  }

  return (
    <div className="flex max-w-screen-sm items-center gap-4">
      <textarea
        placeholder="Post a comment..."
        className="h-[150px] flex-1 resize-none rounded-xl bg-gray-300 p-2"
      ></textarea>
      <div className="">
        <StyledButton
          disabled={false}
          onClick={postNewComment}
          roundingClass={'rounded-lg'}
        >
          Submit
        </StyledButton>
      </div>
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
