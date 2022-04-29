import Link from 'next/link'
import { BiRightArrowAlt } from 'react-icons/bi'

const LoggedOutLanding = () => {
  return (
    <>
      <h1 className="text-6xl font-bold">
        Welcome to{' '}
        <span className="brand-gradient bg-clip-text text-transparent">
          {' '}
          Snapface.
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
