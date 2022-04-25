const DateTimePosted = ({ timePosted }: { timePosted: Date }) => {
  return (
    <span className="mx-3 flex-1 text-right text-sm text-gray-500">
      {timePosted.toLocaleDateString('en-US', {
        dateStyle: 'long',
      })}
      {' at '}
      {timePosted.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })}
    </span>
  )
}

export default DateTimePosted
