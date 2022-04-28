import { ErrorNotification, SuccessNotification } from './Notifications'
import { useMemo } from 'react'

export const InputValidationNotifications = ({
  inputErrors,
}: {
  inputErrors: {
    title: string[]
    tags: string[]
    destinationURL: string[]
    description: string[]
    categories: string[]
    uploadedImageId: string[]
  }
}) => {
  const fieldValidationErrors = useMemo(() => {
    return Object.entries(inputErrors)
      .filter(([fieldName, fieldValue]) => fieldValue.length > 0)
      .map(([fieldName, fieldValue], i) => (
        <ErrorNotification key={`${fieldName}-${i}`}>
          {/* 
            If there are multiple errors for the same field, map out the errors into an ordered list. 
            Else, just print the error without numbering 
          */}
          {fieldValue.length > 1
            ? fieldValue.map((errMessage, i) => (
                <p className="mb-2 last-of-type:mb-0">
                  {i + 1}. {errMessage}
                </p>
              ))
            : fieldValue}
        </ErrorNotification>
      ))
  }, [inputErrors])

  if (fieldValidationErrors.length > 0) return <>{fieldValidationErrors}</>

  return null
}
