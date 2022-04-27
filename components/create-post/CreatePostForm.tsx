import { UploadedImagePreview, FileUploadBox } from '../../components'
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { client } from '../../sanity-scripts/client'
import { SanityImageAssetDocument } from '@sanity/client'
import { MdOutlineErrorOutline } from 'react-icons/md'
import Select, { ActionMeta } from 'react-select'

type Props = {}
const CreatePostForm = ({}: Props) => {
  // Use state to control form fields
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [destinationURL, setDestinationURL] = useState('')
  const [description, setDescription] = useState('')

  // values/state/eventHandlers for categories multiselect field
  const [categoryOptions, setCategoryOptions] = useState<any | null>(null)

  // fetch categories for multi-select box on mount
  useEffect(() => {
    client
      .fetch(`*[_type == 'category']{"label":name, "value":name}`)
      .then((res) => {
        setCategoryOptions(res)
      })
      .catch((err) =>
        console.error('Error fetching category options from server!', err)
      )
  }, [])

  const [categories, setCategories] = useState<any | null>(null)

  useEffect(() => {
    console.log(categories)
  }, [categories])

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

  //TODO: organize the messy logic in this component

  return (
    <>
      <form>
        <div id="row1-Cont" className="justify-evenly sm:flex sm:flex-wrap">
          <div id="titleDescDest-Cont" className="my-8 sm:min-w-[50ch]">
            <ShortTextInput
              name={'Title'}
              placeholder={'Add a title for your post.'}
              value={title}
              setValue={setTitle}
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
                className={'max-w-[500px] text-gray-900'}
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

            {/* // TODO: add react-select <Createable /> component for tags field */}
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
            <ShortTextInput
              name={'Destination'}
              placeholder={'Paste the link where your image comes from.'}
              value={destinationURL}
              setValue={setDestinationURL}
            />
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

type ShortTextProps = {
  name: string
  placeholder: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
}

const ShortTextInput = ({
  name,
  placeholder,
  value,
  setValue,
}: ShortTextProps) => {
  return (
    <label htmlFor={name} className="my-4 flex items-center text-gray-500">
      <span className="mr-10">{name}:</span>
      <input
        className="flex-1 rounded-lg p-2 text-gray-900 shadow-sm"
        id={name}
        type={'text'}
        {...{ placeholder, name, value }}
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
}: ShortTextProps) => {
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
