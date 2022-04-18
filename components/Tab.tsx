type Props = {
  isActive: boolean
  onClick: React.MouseEventHandler
  children: React.ReactNode
}

const Tab = ({ isActive, onClick, children }: Props) => {
  const bottomBColor = isActive
    ? 'border-brand-600'
    : 'border-gray-300 hover:border-brand-300'

  return (
    <button
      className={`flex appearance-none items-center border-b-2 p-4 ${bottomBColor}`}
      {...{ onClick }}
    >
      {children}
    </button>
  )
}

export default Tab