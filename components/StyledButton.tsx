import React, { ReactNode } from 'react'

type Props = {
  onClick: React.MouseEventHandler
  disabled: boolean | undefined
  roundingClass?: string
  btnType?: string
  children: ReactNode
}

const StyledButton = ({
  onClick,
  disabled,
  btnType = 'btn-primary',
  roundingClass = 'rounded-full',
  children,
}: Props) => {
  return (
    <button
      type="button"
      className={`${btnType} flex items-center ${roundingClass}`}
      {...{ onClick, disabled }}
    >
      {children}
    </button>
  )
}

export default StyledButton
