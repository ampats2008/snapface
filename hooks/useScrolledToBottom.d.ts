export const useScrolledToBottom: (options: {
  root: string | null
  rootMargin: string
  threshold: number
}) => [Ref<HTMLDivElement> | undefined, boolean]
