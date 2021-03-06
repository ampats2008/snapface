import React, { useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { BiErrorCircle } from 'react-icons/bi'
import { useGlobalState } from '../store/store'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeInOut } from '../utils/animations'
type Props = {}

const Snackbar = ({}: Props) => {
  const [state, dispatch] = useGlobalState()

  useEffect(() => {
    // set timeOut if message should be timed
    if (state.snackBarState.payload && state.snackBarState.payload.duration)
      setTimeout(
        () => dispatch({ type: 'snackReset' }),
        state.snackBarState.payload.duration * 1000
      )
  }, [state.snackBarState])

  const typeToIconMap: { [a: string]: JSX.Element } = {
    LOADING: (
      <FaSpinner className="mr-4 inline-block h-6 w-6 animate-spin fill-brand-500" />
    ),
    FAILED: (
      <BiErrorCircle className="mr-4 inline-block h-6 w-6 fill-red-500" />
    ),
    SUCCESS: (
      <IoMdCheckmarkCircleOutline className="mr-4 inline-block h-6 w-6 fill-brand-500" />
    ),
  }

  return (
    <AnimatePresence>
      {state.snackBarState.type !== 'IDLE' && (
        <motion.div {...fadeInOut} className="fixed bottom-24 z-20 w-full">
          <div className="mx-auto flex w-fit max-w-[85vw] items-center rounded-xl bg-gray-900 p-5 shadow-xl xl:ml-10">
            {typeToIconMap[state.snackBarState.type]}
            <p className="max-w-[50ch] flex-1 leading-[1.7] text-white">
              {state.snackBarState.payload?.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Snackbar
