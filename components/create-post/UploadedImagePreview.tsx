import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import { SanityImageAssetDocument } from '@sanity/client'
import { MdCancel } from 'react-icons/md'
import { Image as ImgType } from '../../types/Post'

type Props = {
  uploadedImage: { url: SanityImageAssetDocument['url'] }
  title: string
  onCancel: () => void
}
const UploadedImagePreview = ({ uploadedImage, title, onCancel }: Props) => {
  return (
    <div className="relative my-5 h-[50vh]">
      <Image
        className="rounded-2xl bg-gray-900"
        layout="fill"
        objectFit="contain"
        src={uploadedImage.url}
        alt={`${title}`}
        title={`${title}`}
        priority
      />
      <div className="absolute top-0 flex w-full justify-between rounded-t-2xl bg-gray-800 bg-opacity-70 p-5">
        <p className="flex-1 text-xl  text-white">Image Preview</p>
        <button
          title="Cancel image upload"
          className="group appearance-none text-right"
          onClick={onCancel}
        >
          <MdCancel className="h-8 w-8 fill-gray-400 group-hover:fill-red-400" />
        </button>
      </div>
    </div>
  )
}

export default UploadedImagePreview
