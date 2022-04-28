import { client } from '../sanity-scripts/client'
import { ChangeEvent, useState } from 'react'
import { SanityImageAssetDocument } from '@sanity/client'

export const useImageUpload = () => {
  // values/state/eventHandlers for image upload process
  const MAX_IMAGE_SIZE_MB = 8
  const supportedFileTypes = 'PNG, JPG, SVG, GIF, and TIFF' // for error message and upload file box hint.
  const [uploadedImage, setUploadedImage] =
    useState<SanityImageAssetDocument | null>(null)
  const [uploadError, setUploadError] = useState<
    'MAX_IMAGE_SIZE_EXCEEDED' | 'INVALID_FILE_TYPE' | null
  >(null)
  const [isUploadingImg, setIsUploadingImg] = useState(false)
  // TODO: add a popup with loading bar to screen while image uploads
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

  return {
    uploadImage,
    isUploadingImg,
    uploadError,
    supportedFileTypes,
    uploadedImage,
    setUploadedImage,
    MAX_IMAGE_SIZE_MB,
  }
}
