import Image from 'next/image'

const Category = ({
  isActive,
  onClick,
  title,
}: {
  isActive: boolean
  onClick: React.MouseEventHandler
  title: string
}) => {
  const bottomBColor = isActive
    ? 'border-brand-600'
    : 'border-gray-300 hover:border-brand-300'

  return (
    <div
      id="categoryBtn"
      onClick={onClick}
      className={`block cursor-pointer border-b-2 p-4 transition-all sm:border-b-0 sm:border-r-2 ${bottomBColor}`}
    >
      <div
        id="categoryInfoGroup"
        className="mx-auto flex w-max items-center sm:mx-0"
      >
        <Image
          className="rounded-full"
          width={'50px'}
          height={'50px'}
          src={`https://source.unsplash.com/100x100/?${title}`}
        />
        <p className="ml-3 capitalize">{title}</p>
      </div>
    </div>
  )
}

export default Category