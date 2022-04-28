import { ReactNode } from 'react'
import { MdOutlineErrorOutline } from 'react-icons/md'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

export const ErrorNotification = ({ children }: { children: ReactNode }) => {
  return (
    <div id="errorNoti" className="my-8 flex rounded-2xl bg-red-200 p-5 ">
      <MdOutlineErrorOutline className="h-6 w-6 text-red-500" />{' '}
      <span className="ml-2 flex-1">{children}</span>
    </div>
  )
}
export const SuccessNotification = ({ children }: { children: ReactNode }) => {
  return (
    <div id="errorNoti" className="my-8 flex rounded-2xl bg-brand-200 p-5 ">
      <IoMdCheckmarkCircleOutline className="h-6 w-6 text-brand-500" />{' '}
      <span className="ml-2 flex-1">{children}</span>
    </div>
  )
}
