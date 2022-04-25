import { ReactNode } from 'react'

const MenuItem = ({
  onClick,
  className,
  children,
}: {
  onClick: React.MouseEventHandler
  className: string
  children: ReactNode
}) => {
  return (
    <div
      onClick={onClick}
      className={`my-[2px] flex w-full cursor-pointer items-center px-3 py-1 first-of-type:mt-0 first-of-type:rounded-t-lg last-of-type:mb-0 last-of-type:rounded-b-lg ${className}`}
    >
      {children}
    </div>
  )
}

export default MenuItem
