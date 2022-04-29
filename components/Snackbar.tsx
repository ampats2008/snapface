import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { FaSpinner } from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { BiErrorCircle } from 'react-icons/bi'

type commentStatus = {
  type: 'LOADING' | 'FAILED' | 'SUCCESS' | 'IDLE'
  payload: { message: string; timed: boolean } | null
}

type Props = {
  commentStatus: commentStatus
  setCommentStatus: Dispatch<SetStateAction<commentStatus>>
}

const Snackbar = ({ commentStatus, setCommentStatus }: Props) => {
  useEffect(() => {
    // TODO: add fade-in animation onMount

    // set timeOut if message should be timed
    if (commentStatus.payload && commentStatus.payload.timed)
      setTimeout(() => setCommentStatus({ type: 'IDLE', payload: null }), 5000)

    return () => {
      // TODO: add fade-out animation on unMount
    }
  }, [])

  const typeToIconMap: { [a: string]: JSX.Element } = {
    LOADING: (
      <FaSpinner className="mr-4 inline-block h-6 w-6 animate-spin fill-brand-500" />
    ),
    FAILED: (
      <BiErrorCircle className="mr-4 inline-block h-6 w-6 fill-red-500" />
    ),
    SUCCESS: (
      <IoMdCheckmarkCircleOutline className="mr-4 inline-block h-6 w-6 fill-brand-500" />
    ),
  }

  return (
    <div className="fixed bottom-24 z-20 w-full">
      <div className="mx-auto flex w-fit max-w-[85vw] items-center rounded-xl bg-gray-900 p-5 shadow-xl xl:ml-10">
        {typeToIconMap[commentStatus.type]}
        <p className="max-w-[50ch] flex-1 leading-[1.7] text-white">
          {commentStatus.payload?.message}
        </p>
      </div>
    </div>
  )
}

export default Snackbar
