import { UploadedImagePreview, FileUploadBox } from '..'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import CreateableSelect from 'react-select/creatable'
import {
  useImageUpload,
  useInitialCategories,
  useSubmitPost,
} from '../../hooks/useCreatePostHooks'
import StyledButton from '../StyledButton'
import { ShortTextInput, LongTextInput } from '../create-post/TextInputs'
import {
  ErrorNotification,
  SuccessNotification,
} from '../create-post/Notifications'
import Link from 'next/link'
import { InputValidationNotifications } from '../create-post/InputValidationNotis'

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
          <InputValidationNotifications {...{ inputErrors }} />

          {formSubmitStatus.type === 'FAILED' && (
            <ErrorNotification>
              Sorry, something went wrong submitting your post. See the browser
              log for more info.
            </ErrorNotification>
          )}

          {formSubmitStatus.type === 'SUCCESS' && (
            <SuccessNotification>
              Your post was created successfully. View it{' '}
              <Link href={`/post/${formSubmitStatus?.payload?._id}`}>
                <a className="text-brand-600 hover:underline">here.</a>
              </Link>
            </SuccessNotification>
          )}

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
                maxCharCount={500}
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
            </div>
          </div>
          <StyledButton
            roundingClass="rounded-xl mx-auto mt-10 text-lg"
            onClick={submitPost}
            disabled={false}
          >
            Submit
          </StyledButton>
        </form>
      </div>
    </>
  )
}

export default CreatePostForm
