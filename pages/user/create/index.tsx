import Error from 'next/error'
import type { NextPage } from 'next'
import { useUser } from '../../../hooks/useUser'
import {
  Feed,
  Loading,
  ProfileBanner,
  ProfilePostsFilter,
} from '../../../components'
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { client } from '../../../sanity-scripts/client'
import { SanityImageAssetDocument } from '@sanity/client'
import { BsCloudUpload } from 'react-icons/bs'

// Private version of profile page: requires user to be signed in:
// the public user profile page will be a SSR page that doesn't interface with useUser / useSession
const CreatePostPage: NextPage = () => {
  const { data: session, status } = useSession()
  const {
    user: currentUser,
    isLoading,
    isError,
    error,
  } = useUser(session, status) // get the current user using the session.user.id

  useEffect(() => {
    console.log(session)
  }, [session])

  // TODO: CREATE NEW POST:
  // TODO: allow the user to create a new post and POST it to Sanity

  if (status === 'loading' || isLoading) return <Loading />

  if (status === 'unauthenticated' || isError) return <Error statusCode={401} />

  return (
    <main className="py-10 px-4 xl:p-10">
      <h1 className="mb-10 text-3xl font-bold">Make a New Post</h1>
      <CreatePostForm />
    </main>
  )
}

export default CreatePostPage

type Props = {}

const CreatePostForm = ({}: Props) => {
  // Use state to control form fields
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [uploadedImage, setUploadedImage] =
    useState<SanityImageAssetDocument | null>(null)
  const [destinationURL, setDestinationURL] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    console.log('image', uploadedImage)
  }, [uploadedImage])

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof e.target.files === 'undefined' || e.target.files === null) return
    const file = e.target.files[0]
    const { type, name } = file

    // validate file type
    if (
      [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg',
        'image/tiff',
      ].includes(type)
    ) {
      console.log('correct file type')
      client.assets
        .upload('image', file, { contentType: type, filename: name })
        .then((document) => {
          setUploadedImage(document)
        })
        .catch((err) => {
          console.log('an error occurred during file upload:', err)
        })
    }
  }

  return (
    <div>
      <form>
        {/* File upload field */}
        {!uploadedImage ? (
          <FileUploadBox
            uploadImage={uploadImage}
            uploadType={'image'}
            maxFileSize={'20MB'}
            supportedFileTypes={'PNG, JPG, SVG, GIF, and TIFF'}
          />
        ) : (
          <p>show uploaded image here</p>
        )}
      </form>
    </div>
  )
}

const FileUploadBox = ({
  uploadType,
  supportedFileTypes,
  maxFileSize,
  uploadImage,
}: {
  uploadType: string
  supportedFileTypes: string
  maxFileSize: string
  uploadImage: ChangeEventHandler
}) => {
  return (
    // hack: surround the input with a <label> to make the whole thing clickable
    <label htmlFor="image">
      <div className="grid place-items-center rounded-3xl bg-gray-300 p-28">
        <BsCloudUpload className="h-6 w-6" />
        <p className="mt-10">
          Click to upload{' '}
          {['a', 'e', 'i', 'o', 'u'].includes(uploadType[0]) ? 'an' : 'a'}{' '}
          {uploadType}
        </p>
        <p className="mt-10 text-center leading-[2] text-gray-500">
          Supported file formats: {supportedFileTypes}
          <br />
          Max file size permitted: {maxFileSize}
        </p>
      </div>
      <input
        type="file"
        id="image"
        name="image"
        accept="image/png, image/jpeg"
        onChange={uploadImage}
        className="invisible"
      />
    </label>
  )
}
