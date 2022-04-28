import { UploadedImagePreview, FileUploadBox } from '..'
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useImageUpload } from '../../hooks/useImageUpload'
import StyledButton from '../StyledButton'
import { ShortTextInput, LongTextInput } from '../create-post/TextInputs'
import {
  ErrorNotification,
  SuccessNotification,
} from '../create-post/Notifications'
import Link from 'next/link'
import Image from 'next/image'
import { InputValidationNotifications } from '../create-post/InputValidationNotis'
import { useSubmitProfile } from '../../hooks/useSubmitProfile'
import { User } from '../../types/User'
import { buildUrlFor } from '../../sanity-scripts/client'
import { SanityImageAssetDocument } from '@sanity/client'

export type Tag = { label: string; value: string; __isNew__?: boolean }
export type Category = { _id: string; label: string; value: string }

type Props = { userId: string; initialUserInfo: User | undefined }
const EditProfileForm = ({ userId, initialUserInfo }: Props) => {
  // Use state to control form fields
  const [displayName, setDisplayName] = useState(
    initialUserInfo?.userName ?? ''
  )
  const [firstName, setFirstName] = useState(initialUserInfo?.firstName ?? '')
  const [lastName, setLastName] = useState(initialUserInfo?.lastName ?? '')
  const [bio, setBio] = useState(initialUserInfo?.bio ?? '')

  // this enables the preview for the user's banner image if it has already been set.
  const [initialBanner, setInitialBanner] = useState(initialUserInfo?.bannerImg)

  const {
    uploadImage,
    uploadedImage,
    setUploadedImage,
    isUploadingImg,
    uploadError,
    supportedFileTypes,
    MAX_IMAGE_SIZE_MB,
  } = useImageUpload()

  const { submitPost, inputErrors, formSubmitStatus } = useSubmitProfile({
    userId,
    displayName,
    firstName,
    lastName,
    bio,
    uploadedImageId: uploadedImage?._id,
  })

  return (
    <>
      <div className="mx-auto sm:w-[85vw] xl:w-[80vw]">
        <form>
          <h1 className="mb-10 text-3xl font-bold">Edit your profile</h1>
          {/* FORM SUBMIT ERROR / SUCCESS NOTIFICATION AREA */}
          <InputValidationNotifications {...{ inputErrors }} />

          {formSubmitStatus.type === 'FAILED' && (
            <ErrorNotification>
              Sorry, something went wrong updating your profile. See the browser
              log for more info.
            </ErrorNotification>
          )}

          {formSubmitStatus.type === 'SUCCESS' && (
            <SuccessNotification>
              Your profile was updated successfully. View it{' '}
              <Link href={`/user/${formSubmitStatus?.payload?._id}`}>
                <a className="text-brand-600 hover:underline">here.</a>
              </Link>
            </SuccessNotification>
          )}

          <div id="row1-Cont" className="justify-center sm:flex-wrap xl:flex">
            <div id="titleDescDest-Cont" className="mt-8 mb-14 sm:min-w-[50ch]">
              <ShortTextInput
                name={'Display name'}
                placeholder={'Pick a nickname for other users to see.'}
                value={displayName}
                setValue={setDisplayName}
                type="text"
              />
              <ShortTextInput
                name={'First name'}
                placeholder={'What is your given name?'}
                value={firstName}
                setValue={setFirstName}
                type="text"
              />
              <ShortTextInput
                name={'Last name'}
                placeholder={'What is your family name?'}
                value={lastName}
                setValue={setLastName}
                type="text"
              />
              <LongTextInput
                name={'Bio'}
                placeholder={
                  'Give everyone a brief introduction about yourself...'
                }
                value={bio}
                setValue={setBio}
                maxCharCount={500}
              />
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
              <h2
                className="mt-2 mb-4 text-gray-500"
                title="Personalize your profile with a background image."
              >
                Profile banner image:
              </h2>

              {initialBanner ? (
                <UploadedImagePreview
                  {...{
                    uploadedImage: {
                      url: buildUrlFor(initialBanner)
                        .height(400)
                        .width(700)
                        .url(),
                    },
                    title: 'Profile banner',
                    onCancel: () => setInitialBanner(undefined),
                  }}
                />
              ) : (
                <NoBannerYet
                  {...{
                    uploadedImage,
                    uploadImage,
                    setUploadedImage,
                    supportedFileTypes,
                  }}
                />
              )}
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

export default EditProfileForm

const NoBannerYet = ({
  uploadedImage,
  uploadImage,
  setUploadedImage,
  supportedFileTypes,
}: {
  uploadedImage: SanityImageAssetDocument | null
  uploadImage: ChangeEventHandler
  setUploadedImage: Dispatch<SetStateAction<SanityImageAssetDocument | null>>
  supportedFileTypes: string
}) => {
  return (
    <>
      {!uploadedImage ? (
        <FileUploadBox
          uploadImage={uploadImage}
          uploadType={'new image'}
          maxFileSize={'8MB'}
          supportedFileTypes={supportedFileTypes}
        />
      ) : (
        <UploadedImagePreview
          {...{
            uploadedImage,
            title: 'Profile banner',
            onCancel: () => setUploadedImage(null),
          }}
        />
      )}
    </>
  )
}
