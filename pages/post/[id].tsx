import type { NextPage, NextPageContext } from 'next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DestinationLink, LikeBtn, Loading } from '../../components'
import { usePostDetail } from '../../hooks/userPostDetail'
import { client } from '../../sanity-scripts/client'
import { Comment, Post } from '../../types/Post'
import Image from 'next/image'
import { buildUrlFor } from '../../sanity-scripts/client'

type Props = {
  initialData: Post
}

// Depends on User to be signed in:
const PostDetails: NextPage<Props> = ({ initialData }) => {
  const { id: postID } = useRouter().query

  const { post, isLoading, isError } = usePostDetail(postID, initialData)

  useEffect(() => {
    console.log('My Post:', post)
  }, [post])

  if (isLoading) return <Loading />

  if (isError) return <Error statusCode={401} />

  return (
    <main className="p-10">
      <h1 className="mb-5 text-3xl font-bold">{post.title}</h1>

      <div className="relative my-5 h-[50vh] max-w-screen-lg">
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

        {/* only show like button in this position on mobile (sm:hidden) */}
        <LikeBtn posClass={'absolute top-3 right-3 sm:hidden'} />
      </div>

      <div id="likeGroup" className="hidden w-max items-center sm:flex">
        {/* desktop like count / btn */}
        <LikeBtn posClass={'my-5'} />
        <p className="mx-2 text-lg text-brand-600">{post.likes.length.toLocaleString()}</p>
      </div>

      <p className="mb-5 max-w-[45ch] text-xl leading-[2]">
        {post.description} Lorem ipsum dolor, sit amet consectetur adipisicing
        elit. Incidunt vitae error, quidem repellendus modi amet exercitationem
        dolorem tenetur inventore tempore a magni dicta odit laudantium
        laboriosam aliquid in temporibus quam.
      </p>

      <div id="tags" className="py-6">
        {post.tags.map((tag) => (
          <PostTag key={tag} {...{ tag }} />
        ))}
      </div>

      {/* Comment Section */}
      <aside id="comments">
        {post.comments.map((comment) => (
          <Comment
            key={`${comment._key}-${comment.comment}-${comment.postedBy._ref}`}
            {...{ comment }}
          />
        ))}
      </aside>
    </main>
  )
}

export default PostDetails

const Comment = ({ comment }: { comment: Comment }) => {
  // TODO: use postedBy to fetch user's profileImg, displayName, or full name

  const timePosted = new Date(comment.timeStamp)

  return (
    <div
      id="comment"
      className="my-5 w-fit rounded-lg bg-gray-100 p-3 shadow-md sm:max-w-screen-sm"
    >
      <p className="flex items-center">
        <div className="inline-block">
          <Image
            className="rounded-full"
            src={'https://source.unsplash.com/50x50/?technology'}
            height="40"
            width="40"
          />
        </div>
        {/* username */}
        <span className="ml-2 font-semibold">Anthony M</span>
        <span className="mx-3 flex-1 text-right text-sm text-gray-500">
          {timePosted.toLocaleDateString('en-US', { dateStyle: 'long' })}
          {' at '}
          {timePosted.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </span>
      </p>
      <p className="my-2 leading-[1.7]">
        {comment.comment.toLowerCase()} Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Nisi aut quaerat quasi libero, error amet dolorem
        assumenda quos voluptatibus repellat, omnis expedita iste praesentium
        consequuntur eos tempore, eaque quas voluptates voluptas aliquid saepe
        earum? Repellendus illum aut repudiandae esse sunt.
      </p>
    </div>
  )
}

const PostTag = ({ tag }: { tag: string }) => {
  // TODO: add Link to a page which fetches all posts that contain the tag that the user clicked on
  // TODO: add next-link with href='/discover/tag/:tag'

  return (
    <span className="mx-1 w-max cursor-pointer items-center rounded-full bg-brand-900 py-2 px-3 text-sm text-white  shadow-sm transition-colors first-of-type:ml-0 hover:bg-brand-600">
      {tag.toLowerCase()}
    </span>
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
