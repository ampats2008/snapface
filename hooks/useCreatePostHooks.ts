import { client } from '../sanity-scripts/client'
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { SanityImageAssetDocument } from '@sanity/client'
import { Category, Tag } from '../components/create-post/CreatePostForm'
import { Session } from '../types/Session'
import { v4 as uuidv4, validate } from 'uuid'

export const useInitialCategories = () => {
  // values/state/eventHandlers for categories multiselect field
  const [categoryOptions, setCategoryOptions] = useState<
    | [
        {
          label: string
          value: string
        }
      ]
    | null
  >(null)

  // fetch categories for multi-select box on mount
  useEffect(() => {
    client
      .fetch(`*[_type == 'category']{_id, "label":name, "value":name}`)
      .then((res) => {
        setCategoryOptions(res)
      })
      .catch((err) =>
        console.error('Error fetching category options from server!', err)
      )
  }, [])

  return categoryOptions
}

export const useImageUpload = () => {
  // values/state/eventHandlers for image upload process
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

type useSubmitPostProps = {
  userId: Session['user']['id']
  title: string
  tags: Tag[] | null
  destinationURL: string
  description: string
  categories: Category[] | null
  uploadedImageId?: string
}
type ValueOf<T> = T[keyof T]
type FieldValues = ValueOf<useSubmitPostProps>
type FieldNameKeys = keyof Omit<useSubmitPostProps, 'userId'>

export const useSubmitPost = ({
  userId,
  title,
  tags,
  destinationURL,
  description,
  categories,
  uploadedImageId,
}: useSubmitPostProps) => {
  // object containing possible form input errors
  const [inputErrors, setInputErrors] = useState<{
    [K in FieldNameKeys]: string[]
  }>({
    title: [],
    tags: [],
    destinationURL: [],
    description: [],
    categories: [],
    uploadedImageId: [],
  })

  useEffect(() => {
    console.log('errors:', inputErrors)
  }, [inputErrors])

  const [formSubmitStatus, setFormSubmitStatus] = useState<{
    type: string
    payload: any
  }>({ type: 'IDLE', payload: null })

  const submitPost: React.MouseEventHandler = () => {
    // runs onClick of form submit btn:
    setInputErrors({
      title: [],
      tags: [],
      destinationURL: [],
      description: [],
      categories: [],
      uploadedImageId: [],
    })
    console.log('fields submitted', {
      title,
      tags,
      destinationURL,
      description,
      categories,
      uploadedImageId,
    })

    // 1. validate inputs
    const isTitleError = validateField('title', title, setInputErrors) // prettier-ignore
    const isTagError = validateField('tags', tags, setInputErrors) // prettier-ignore
    const isURLError = validateField('destinationURL', destinationURL, setInputErrors) // prettier-ignore
    const isDescError = validateField('description', description, setInputErrors) // prettier-ignore
    const isCategoryError = validateField('categories', categories, setInputErrors) // prettier-ignore
    const isImageError = validateField('uploadedImageId', uploadedImageId, setInputErrors) // prettier-ignore

    // prettier-ignore
    const noInputErrors = !(isTitleError || isTagError || isURLError || isDescError || isCategoryError || isImageError)

    if (noInputErrors) {
      // 2. format object as Sanity 'Post' document
      const doc = {
        _type: 'post',
        categories: categories?.map((cat) => ({
          _key: uuidv4(),
          _ref: cat._id,
          _type: 'reference',
        })),
        tags: tags?.map((tag) => tag.value.toLowerCase()),
        description,
        destination: destinationURL,
        title,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedImageId,
          },
        },
        postedBy: {
          _ref: userId,
          _type: 'postedBy',
        },
      }
      // 3. create the document on the DB
      client
        .create(doc)
        .then((newDoc) => {
          console.log('success! heres the new document:', newDoc)
          setFormSubmitStatus({ type: 'SUCCESS', payload: newDoc })
        })
        .catch((err) => {
          console.log(
            'Something went wrong submitting your post. More info:',
            err.message
          )
          setFormSubmitStatus({ type: 'FAILED', payload: err.message })
        })
    }
  }

  return { formSubmitStatus, submitPost, inputErrors }
}

// HELPER FUNCTIONS

const validateField = (
  fieldName: FieldNameKeys,
  fieldVal: FieldValues,
  setInputErrors: Dispatch<SetStateAction<{ [K in FieldNameKeys]: string[] }>>
) => {
  let errors: string[] = []
  switch (fieldName) {
    case 'title':
      if (!fieldVal) errors.push(`The title field is required. Please add one.`)
      else if (fieldVal?.length > 100)
        errors.push(`Your title is too long (it is over 100 characters).`)
      break

    case 'tags':
      // check if fieldVal is a Tag[]
      if (
        Array.isArray(fieldVal) &&
        fieldVal.length > 0 &&
        !isCategoryArr(fieldVal)
      ) {
        // each tag can't have a space in the middle of the value.
        // ex: tags: ['validValue', 'invalid value']
        const problemTag = fieldVal?.find(
          (tag: Tag) => tag.value.indexOf(' ') >= 0
        )
        if (typeof problemTag !== 'undefined')
          errors.push(
            `Tags can't contain spaces! At least one of your tags has a space in it.`
          )
      }
      break

    case 'destinationURL':
      const validURL =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
      if (
        fieldVal &&
        typeof fieldVal === 'string' &&
        !fieldVal.match(validURL)
      ) {
        errors.push(
          `Your destination URL is invalid (it must begin with "http://" or "https://").`
        )
      }
      break

    case 'description':
      if (fieldVal && fieldVal?.length > 500)
        errors.push(`Your description is too long (it is over 500 characters).`)
      break

    case 'categories':
      // check if fieldVal is a Category[]
      if (!fieldVal || (Array.isArray(fieldVal) && fieldVal.length === 0)) {
        console.log('categories', fieldVal)
        errors.push('Please select at least one category for your post!')
      }
      break

    case 'uploadedImageId':
      if (!fieldVal)
        errors.push(
          `You must upload an image before submitting your post! Please add one.`
        )
      break

    default:
      console.error('Error: Missing a field validation check!')
      break
  }

  // if there are errors:
  // (1) return true
  // (2) assign the errors to the inputErrors object (so that they can be displayed to the user):
  // else:
  // (1) return false
  if (errors.length > 0) {
    setInputErrors((prev) => {
      return { ...prev, [fieldName]: errors }
    })
    return true
  } else {
    return false
  }
}

// Type guard to check if array is a Category[] or Tag[]
const isCategoryArr = (array: Category[] | Tag[]): array is Category[] => {
  return (array as Category[])[0]._id !== undefined
}
