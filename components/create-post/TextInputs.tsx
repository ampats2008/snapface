import { Dispatch, SetStateAction } from 'react'

type ShortTextProps = {
  name: string
  placeholder: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  type: string
  pattern?: string
}
export const ShortTextInput = ({
  name,
  placeholder,
  value,
  setValue,
  type,
  pattern,
}: ShortTextProps) => {
  return (
    <label htmlFor={name} className="my-4 flex items-center text-gray-500">
      <span className="mr-10">{name}:</span>
      <input
        className="flex-1 rounded-lg p-2 text-gray-900 shadow-sm"
        id={name}
        {...{ placeholder, name, value, type, pattern }}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  )
}
export const LongTextInput = ({
  name,
  placeholder,
  value,
  setValue,
  maxCharCount,
}: Omit<ShortTextProps, 'type' | 'pattern'> & { maxCharCount: number }) => {
  return (
    <label htmlFor={name}>
      <div className="mt-5 mb-2 flex items-center text-gray-500">
        <span className="mr-auto">{name}:</span>
        <span
          className={`text-sm ${
            value.length > maxCharCount ? 'text-red-500' : ''
          }`}
        >
          {value.length} / {maxCharCount}
        </span>
      </div>
      <textarea
        className="max-h-[200px] w-full rounded-lg p-2 text-gray-900 shadow-sm"
        id={name}
        {...{ placeholder, name, value }}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  )
}
