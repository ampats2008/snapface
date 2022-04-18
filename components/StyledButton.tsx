import React, { ReactNode } from 'react'

type Props = {
    onClick: React.MouseEventHandler,
    disabled: boolean | undefined,
    children: ReactNode,
}

const StyledButton = ({ onClick, disabled, children }: Props) => {
  return (
    <button className="btn-primary rounded-full" {...{ onClick, disabled }}>
      {children}
    </button>
  )
}

export default StyledButton