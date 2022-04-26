import { ChangeEventHandler } from 'react'
import { BsCloudUpload } from 'react-icons/bs'

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
      <div className="group grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-gray-400 bg-gray-300 p-28 transition-opacity hover:opacity-70">
        <BsCloudUpload className="h-6 w-6 transition-colors group-hover:fill-brand-600" />
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
        accept="image/*"
        onChange={uploadImage}
        className="invisible"
      />
    </label>
  )
}

export default FileUploadBox
