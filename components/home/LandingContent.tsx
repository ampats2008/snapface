import Link from 'next/link'
import { BiRightArrowAlt } from 'react-icons/bi'

const LandingContent = () => {
  return (
    <>
      <h1 className="text-6xl font-bold">
        Welcome to <span className="bg-clip-text text-transparent brand-gradient"> Snapface.</span>
      </h1>
      <p className="mt-5 text-2xl">The anti-social, social media platform.</p>
      <Link href={'/login'}>
        <a className="mt-5 w-max btn-primary flex items-center rounded-full">
          Sign up now <BiRightArrowAlt className="ml-1 inline-block h-5 w-5" />
        </a>
      </Link>
    </>
  )
}

export default LandingContent
