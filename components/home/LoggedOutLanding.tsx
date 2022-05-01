import { motion } from 'framer-motion'
import Link from 'next/link'
import { BiRightArrowAlt } from 'react-icons/bi'

const LoggedOutLanding = () => {
  return (
    <>
      <h1 className=" text-6xl font-bold ">
        <span className="brand-gradient bg-clip-text text-transparent">
          Welcome to
        </span>{' '}
        <span>
          {'Snapface.'.split('').map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'tween',
                ease: 'backInOut',
                duration: 0.3,
                delay: i * 0.07 + 0.25,
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      </h1>
      <p className="mt-5 text-2xl">The anti-social, social media platform.</p>
      <Link href={'/auth/signin'}>
        <a className="btn-primary mt-5 flex w-max items-center rounded-full">
          Sign up now <BiRightArrowAlt className="ml-1 inline-block h-5 w-5" />
        </a>
      </Link>
    </>
  )
}

export default LoggedOutLanding
