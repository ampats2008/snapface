import Image from 'next/image'
import { motion, AnimateSharedLayout } from 'framer-motion'

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

  const barColor = isActive
    ? 'bg-brand-600'
    : 'bg-gray-300 group-hover:bg-brand-300'

  return (
    <div
      id="categoryBtn"
      onClick={onClick}
      className={`group relative block cursor-pointer border-b-2 p-4 transition-all sm:border-b-0 sm:transition-none ${bottomBColor}`}
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
        {/* Tab styles for animated tabs (only viewable on vw's > sm:) */}
        <div
          id="inactiveTab"
          className={`absolute z-0 bg-gray-300 group-hover:bg-brand-300 sm:right-0 sm:h-full sm:w-[2px]`}
        ></div>
        {isActive && (
          <motion.div
            animate
            layoutId="activeTab"
            className={`absolute z-10 bg-brand-600 sm:right-0 sm:h-full sm:w-[2px]`}
          ></motion.div>
        )}
      </div>
    </div>
  )
}

export default Category
