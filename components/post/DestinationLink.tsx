import { FiExternalLink } from 'react-icons/fi'

const DestinationLink = ({
  destinationURL,
  posClass,
}: {
  destinationURL: string
  posClass: string
}) => {
  // format the destinationURL before displaying it
  const { hostname } = new URL(destinationURL)
  const hostnameNoPrefix = hostname.includes('www')
    ? hostname.slice(hostname.indexOf('www.') + 4)
    : hostname
  return (
    <a
      href={destinationURL}
      onClick={(e) => {
        e.stopPropagation() // don't click through to post Image
      }}
      target={'_blank'}
      rel="noreferrer"
      className={`
        ${posClass} 
        flex w-max items-center rounded-full bg-gray-800 bg-opacity-70 py-2
        px-3 text-sm text-white drop-shadow-md
        transition-colors hover:bg-gray-600 hover:bg-opacity-70
        `}
    >
      {hostnameNoPrefix.length > 12
        ? hostnameNoPrefix.slice(0, 12).trim() + '...'
        : hostnameNoPrefix}
      <FiExternalLink className="ml-2 inline-block h-4 w-4" />
    </a>
  )
}

export default DestinationLink
