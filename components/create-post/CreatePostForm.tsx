import { UploadedImagePreview, FileUploadBox } from '../../components'
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MdOutlineErrorOutline } from 'react-icons/md'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import Select, { ActionMeta } from 'react-select'
import CreateableSelect from 'react-select/creatable'
import {
  useImageUpload,
  useInitialCategories,
  useSubmitPost,
} from '../../hooks/useCreatePostHooks'
import StyledButton from '../StyledButton'
import Link from 'next/link'

export type Tag = { label: string; value: string; __isNew__?: boolean }
export type Category = { _id: string; label: string; value: string }

type Props = { userId: string }
const CreatePostForm = ({ userId }: Props) => {
  // Use state to control form fields
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<Tag[] | null>(null)
  const [destinationURL, setDestinationURL] = useState('')
  const [description, setDescription] = useState('')

  const categoryOptions = useInitialCategories()
  const [categories, setCategories] = useState<Category[] | null>(null)

  const {
    uploadImage,
    uploadedImage,
    setUploadedImage,
    isUploadingImg,
    uploadError,
    supportedFileTypes,
    MAX_IMAGE_SIZE_MB,
  } = useImageUpload()

  useEffect(() => {
    console.log(tags)
  }, [tags])

  const { submitPost, inputErrors, formSubmitStatus } = useSubmitPost({
    userId,
    title,
    tags,
    destinationURL,
    description,
    categories,
    uploadedImageId: uploadedImage?._id,
  })

  return (
    <>
      <div className="mx-auto sm:w-[85vw] xl:w-[80vw]">
        <form>
          <h1 className="mb-10 text-3xl font-bold">Make a New Post</h1>
          {/* FORM SUBMIT ERROR / SUCCESS NOTIFICATION AREA */}
          <FormNotifications {...{ inputErrors, formSubmitStatus }} />
          <div
            id="row1-Cont"
            className="justify-center sm:flex-wrap xl:flex xl:justify-between"
          >
            <div id="titleDescDest-Cont" className="mt-8 mb-14 sm:min-w-[50ch]">
              <ShortTextInput
                name={'Title'}
                placeholder={'Add a title for your post.'}
                value={title}
                setValue={setTitle}
                type="text"
              />
              <LongTextInput
                name={'Description'}
                placeholder={'Describe what your post is about...'}
                value={description}
                setValue={setDescription}
              />
              {/* Multi-select for categories */}
              <div className="mt-2">
                <p className="mb-1 text-gray-500">Categories:</p>
                <Select
                  placeholder={'Select a category...'}
                  className={'text-gray-900 shadow-sm xl:max-w-[500px]'}
                  // TODO: change theme to match brand (it is currently blue)
                  styles={{
                    placeholder: (defaultStyles) => {
                      return {
                        ...defaultStyles,
                        color: 'rgb(156, 163, 175)',
                      }
                    },
                  }}
                  isMulti={true}
                  //*: weird issue with typescript definitions from react-select. Works fine though.
                  //@ts-ignore
                  onChange={setCategories}
                  options={categoryOptions}
                  defaultValue={categories}
                />
              </div>
              {/* Createable multi-select for tags */}
              <div className="mt-2">
                <p className="mb-1 text-gray-500">Tags:</p>
                <CreateableSelect
                  isMulti={true}
                  placeholder={'Make a list of tags...'}
                  className={'text-gray-900 shadow-sm xl:max-w-[500px]'}
                  // TODO: change theme to match brand (it is currently blue)
                  styles={{
                    placeholder: (defaultStyles) => {
                      return {
                        ...defaultStyles,
                        color: 'rgb(156, 163, 175)',
                      }
                    },
                  }}
                  //*: weird issue with typescript definitions from react-select. Works fine though.
                  //@ts-ignore
                  onChange={setTags}
                />
              </div>
            </div>
            <div
              id="fileUploadBox"
              className="max-w-screen-lg flex-1 px-3 sm:px-10"
            >
              {/* ERROR NOTIFICATIONS -- these occur onFileUpload, not onFormSubmit */}
              {uploadError === 'MAX_IMAGE_SIZE_EXCEEDED' && (
                <ErrorNotification>
                  The file you uploaded was too big (&gt; {MAX_IMAGE_SIZE_MB}
                  MB)! Please try again.
                </ErrorNotification>
              )}
              {uploadError === 'INVALID_FILE_TYPE' && (
                <ErrorNotification>
                  The file you uploaded was not a supported file type (
                  {supportedFileTypes})! Please try again.
                </ErrorNotification>
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
              <ShortTextInput
                name={'Destination'}
                placeholder={'Paste the link where your image comes from.'}
                value={destinationURL}
                setValue={setDestinationURL}
                type="url"
                pattern="https?://.+"
              />
              <StyledButton
                roundingClass="rounded-full mx-auto mt-10"
                onClick={submitPost}
                disabled={false}
              >
                Submit
              </StyledButton>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreatePostForm

const ErrorNotification = ({ children }: { children: ReactNode }) => {
  return (
    <div id="errorNoti" className="my-8 flex rounded-2xl bg-red-200 p-5 ">
      <MdOutlineErrorOutline className="h-6 w-6 text-red-500" />{' '}
      <span className="ml-2">{children}</span>
    </div>
  )
}

const SuccessNotification = ({ children }: { children: ReactNode }) => {
  return (
    <div id="errorNoti" className="my-8 flex rounded-2xl bg-brand-200 p-5 ">
      <IoMdCheckmarkCircleOutline className="h-6 w-6 text-brand-500" />{' '}
      <span className="ml-2">{children}</span>
    </div>
  )
}

const FormNotifications = ({
  inputErrors,
  formSubmitStatus,
}: {
  inputErrors: {
    title: string[]
    tags: string[]
    destinationURL: string[]
    description: string[]
    categories: string[]
    uploadedImageId: string[]
  }
  formSubmitStatus: {
    type: string
    payload: any
  }
}) => {
  const fieldValidationErrors = useMemo(() => {
    return Object.entries(inputErrors)
      .filter(([fieldName, fieldValue]) => fieldValue.length > 0)
      .map(([fieldName, fieldValue], i) => (
        <ErrorNotification key={`${fieldName}-${i}`}>
          {fieldValue}
        </ErrorNotification>
      ))
  }, [inputErrors])

  if (fieldValidationErrors.length > 0) return <>{fieldValidationErrors}</>

  if (formSubmitStatus.type === 'FAILED')
    return (
      <>
        <ErrorNotification>
          Sorry, something went wrong submitting your post. See the browser log
          for more info.
        </ErrorNotification>
      </>
    )

  if (formSubmitStatus.type === 'SUCCESS')
    return (
      <>
        <SuccessNotification>
          Your post was created successfully. View it{' '}
          <Link href={`/post/${formSubmitStatus?.payload?._id}`}>
            <a className="text-brand-600 hover:underline">here.</a>
          </Link>
        </SuccessNotification>
      </>
    )
  return null
}

type ShortTextProps = {
  name: string
  placeholder: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  type: string
  pattern?: string
}

const ShortTextInput = ({
  name,
  placeholder,
  value,
  setValue,
  type,
  pattern,
}: ShortTextProps) => {
  return (
    <label htmlFor={name} className="my-4 flex items-center text-gray-500">
      <span className="mr-10">{name}:</span>
      <input
        className="flex-1 rounded-lg p-2 text-gray-900 shadow-sm"
        id={name}
        {...{ placeholder, name, value, type, pattern }}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  )
}

const LongTextInput = ({
  name,
  placeholder,
  value,
  setValue,
}: Omit<ShortTextProps, 'type' | 'pattern'>) => {
  const MAX_DESC_COUNT = 500
  return (
    <label htmlFor={name}>
      <div className="mt-5 mb-2 flex items-center text-gray-500">
        <span className="mr-auto">{name}:</span>
        <span
          className={`text-sm ${
            value.length > MAX_DESC_COUNT ? 'text-red-500' : ''
          }`}
        >
          {value.length} / {MAX_DESC_COUNT}
        </span>
      </div>
      <textarea
        className="max-h-[200px] w-full rounded-lg p-2 text-gray-900 shadow-sm"
        id={name}
        {...{ placeholder, name, value }}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  )
}
