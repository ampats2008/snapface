import { UploadedImagePreview, FileUploadBox } from '../../components'
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { client } from '../../sanity-scripts/client'
import { SanityImageAssetDocument } from '@sanity/client'
import { MdOutlineErrorOutline } from 'react-icons/md'

type Props = {}
const CreatePostForm = ({}) => {
  // Use state to control form fields
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [destinationURL, setDestinationURL] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  // values for image upload process
  const MAX_IMAGE_SIZE_MB = 8
  const supportedFileTypes = 'PNG, JPG, SVG, GIF, and TIFF' // for error message and upload file box hint.
  const [uploadedImage, setUploadedImage] =
    useState<SanityImageAssetDocument | null>(null)
  const [uploadError, setUploadError] = useState<
    'MAX_IMAGE_SIZE_EXCEEDED' | 'INVALID_FILE_TYPE' | null
  >(null)
  const [isUploadingImg, setIsUploadingImg] = useState(false) // TODO: add a popup with loading bar to screen while image uploads

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    // if the file from the input field is undefined or null, break out of the function
    if (typeof e.target.files === 'undefined' || e.target.files === null) return
    const file = e.target.files[0]
    const { type, name, size } = file

    // Set booleans for validation
    const MAX_IMAGE_SIZE_EXCEEDED = size > MAX_IMAGE_SIZE_MB * 1000000
    const INVALID_FILE_TYPE = ![
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/svg+xml',
      'image/tiff',
    ].includes(type)

    // Run validation checks
    if (MAX_IMAGE_SIZE_EXCEEDED) setUploadError('MAX_IMAGE_SIZE_EXCEEDED')
    if (INVALID_FILE_TYPE) setUploadError('INVALID_FILE_TYPE')

    // *: if one of the checks failed, break before upload
    if (MAX_IMAGE_SIZE_EXCEEDED || INVALID_FILE_TYPE) return

    // Else: upload the image:
    setIsUploadingImg(true)
    console.log('correct file type')
    client.assets
      .upload('image', file, { contentType: type, filename: name })
      .then((document) => {
        setIsUploadingImg(false)
        setUploadedImage(document)
      })
      .catch((err) => {
        console.log('an error occurred during file upload:', err)
      })
  }

  return (
    <>
      <form>
        <div id="row1-Cont" className="sm:flex sm:flex-wrap">
          <div id="titleDescDest-Cont" className="">
            {/* // TODO: add fields for every property of a Post document
             */}
            Title:
            <br /> Desc: <br /> DestURL: <br />
          </div>
          <div id="fileUploadBox" className="min-w-fit px-3 sm:px-10">
            {/* ERROR NOTIFICATIONS */}
            {uploadError === 'MAX_IMAGE_SIZE_EXCEEDED' && (
              <UploadErrorNotification>
                The file you uploaded was too big (&gt; {MAX_IMAGE_SIZE_MB}MB)!
                Please try again.
              </UploadErrorNotification>
            )}
            {uploadError === 'INVALID_FILE_TYPE' && (
              <UploadErrorNotification>
                The file you uploaded was not a supported file type (
                {supportedFileTypes})! Please try again.
              </UploadErrorNotification>
            )}
            {/* FILE UPLOAD FIELD */}
            {!uploadedImage ? (
              <FileUploadBox
                uploadImage={uploadImage}
                uploadType={'image'}
                maxFileSize={'8MB'}
                supportedFileTypes={supportedFileTypes}
              />
            ) : (
              <UploadedImagePreview
                {...{ uploadedImage, title, setUploadedImage }}
              />
            )}
          </div>
        </div>
      </form>
    </>
  )
}

export default CreatePostForm

const UploadErrorNotification = ({ children }: { children: ReactNode }) => {
  return (
    <div id="errorNoti" className="my-8 flex rounded-2xl bg-red-200 p-5 ">
      <MdOutlineErrorOutline className="h-6 w-6 text-red-500" />{' '}
      <span className="ml-2">{children}</span>
    </div>
  )
}
