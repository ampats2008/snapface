import { UploadedImagePreview, FileUploadBox } from '../../components'
import { ChangeEvent, useEffect, useState } from 'react'
import { client } from '../../sanity-scripts/client'
import { SanityImageAssetDocument } from '@sanity/client'

type Props = {}
const CreatePostForm = ({}) => {
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
    console.log('🚀 ~ file: index.tsx ~ line 68 ~ uploadImage ~ name', name)
    console.log('🚀 ~ file: index.tsx ~ line 68 ~ uploadImage ~ type', type)

    // validate file type
    if (
      [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg+xml',
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
    } else {
      console.log('invalid file type')
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
          <UploadedImagePreview
            {...{ uploadedImage, title, setUploadedImage }}
          />
        )}
      </form>
    </div>
  )
}

export default CreatePostForm
