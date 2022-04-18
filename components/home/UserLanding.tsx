import Link from 'next/link'
import { BiRightArrowAlt } from 'react-icons/bi'
import { User } from '../../types/User'

type Props = {
  user: User
}

const LandingContent = ({ user }: Props) => {
  return (
    <>
      <h1 className="text-6xl font-bold">
        <span className="text-brand-600">Welcome,</span> {user.firstName}.
      </h1>
      <p className="mt-5 text-2xl">What would you like to do now?</p>

      <div id='userMenu'>
        <Link href={`/user/${user._id}`}>
            <a className="btn-primary mt-5 flex w-max items-center rounded-full">
            See my profile<BiRightArrowAlt className="ml-1 inline-block h-5 w-5" />
            </a>
        </Link>
      </div>
    </>
  )
}

export default LandingContent
