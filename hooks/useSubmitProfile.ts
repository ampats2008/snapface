import { client } from '../sanity-scripts/client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Session } from 'next-auth/core/types'
import { useQueryClient } from 'react-query'

type Args = {
  userId: Session['user']['id']
  uploadedImageId?: string
  displayName: string
  firstName: string
  lastName: string
  bio: string
}

type ValueOf<T> = T[keyof T]
type FieldValues = ValueOf<Args>
type FieldNameKeys = keyof Omit<Args, 'userId'>

export const useSubmitProfile = ({
  userId,
  displayName,
  firstName,
  lastName,
  bio,
  uploadedImageId,
}: Args) => {
  // object containing possible form input errors
  const [inputErrors, setInputErrors] = useState<{
    [K in FieldNameKeys]: string[]
  }>({
    displayName: [],
    firstName: [],
    lastName: [],
    bio: [],
    uploadedImageId: [],
  })

  useEffect(() => {
    console.log('errors:', inputErrors)
  }, [inputErrors])

  const queryClient = useQueryClient()

  const [formSubmitStatus, setFormSubmitStatus] = useState<{
    type: string
    payload: any
  }>({ type: 'IDLE', payload: null })

  const submitPost: React.MouseEventHandler = () => {
    // runs onClick of form submit btn:
    setInputErrors({
      displayName: [],
      firstName: [],
      lastName: [],
      bio: [],
      uploadedImageId: [],
    })
    console.log('fields submitted', {
      displayName,
      firstName,
      lastName,
      bio,
      uploadedImageId,
    })

    // 1. validate inputs
    const isDisplayNameError = validateField('displayName', displayName, setInputErrors) // prettier-ignore
    const isFirstNameError = validateField('firstName', firstName, setInputErrors) // prettier-ignore
    const isLastNameError = validateField('lastName', lastName, setInputErrors) // prettier-ignore
    const isBioError = validateField('bio', bio, setInputErrors) // prettier-ignore
    const isImageError = validateField('uploadedImageId', uploadedImageId, setInputErrors) // prettier-ignore

    // prettier-ignore
    const noInputErrors = !(isDisplayNameError || isFirstNameError || isLastNameError || isBioError || isImageError)

    if (noInputErrors) {
      // 2. update user document with new data
      client
        .patch(userId)
        .setIfMissing(
          uploadedImageId
            ? {
                bannerImg: {
                  _type: 'image',
                  asset: {
                    _ref: uploadedImageId,
                    _type: 'reference',
                  },
                },
              }
            : {}
        )
        .setIfMissing({ bio: '' })
        .set({ firstName, lastName }) // required fields
        .set(displayName ? { userName: displayName } : {})
        .set(bio ? { bio } : {})
        .set(uploadedImageId ? { 'bannerImg.asset._ref': uploadedImageId } : {})
        .commit()
        .then((newDoc) => {
          console.log('success! heres the new document:', newDoc)
          setFormSubmitStatus({ type: 'SUCCESS', payload: newDoc })
          queryClient.setQueriesData(['getUser'], newDoc) // !: doesn't seem to be working, changes are not reflected immediately
          queryClient.invalidateQueries('getUser')
          console.log(newDoc)
        })
        .catch((err) => {
          console.log(
            'Something went wrong submitting your post. More info:',
            err.message
          )
          setFormSubmitStatus({ type: 'FAILED', payload: err.message })
        })
      console.log('form submitted')
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
    case 'displayName':
      if (fieldVal)
        if (fieldVal?.length > 20)
          errors.push(
            `Your display name is too long (it is over 20 characters).`
          )
        else if (fieldVal?.length < 4)
          errors.push(
            `Your display name is too short (it must be at least 4 characters).`
          )
      break

    case 'firstName':
    case 'lastName':
      const firstOrLastName =
        fieldName === 'firstName' ? 'first name' : 'last name'
      if (!fieldVal || fieldVal.length === 0)
        errors.push(`The ${firstOrLastName} field is required. Please add one.`)
      else if (fieldVal?.length < 2)
        errors.push(
          `Your ${firstOrLastName} is too short (it must be at least 2 characters).`
        )
      else if (fieldVal?.length > 20)
        errors.push(
          `Your ${firstOrLastName} is too long (it is over 20 characters).`
        )
      break

    case 'bio':
      if (fieldVal && fieldVal?.length > 500)
        errors.push(`Your bio is too long (it is over 500 characters).`)
      break

    case 'uploadedImageId':
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
