import Link from 'next/link'
import { BiRightArrowAlt, BiUserCircle } from 'react-icons/bi'
import { MdPostAdd } from 'react-icons/md'
import { IoCompassOutline } from 'react-icons/io5'
import { User } from '../../types/User'

type Props = {
  user: User
}

const LandingContent = ({ user }: Props) => {
  return (
    <>
      <div className="grid min-h-[30vh] place-content-center p-4">
        <h1 className="text-6xl font-bold">
          <span className="brand-gradient bg-clip-text text-transparent">
            Welcome,
          </span>{' '}
          {user.firstName}.
        </h1>
        <p className="mt-5 text-2xl">What would you like to do now?</p>
      </div>

      <div id="userMenu" className="grid-cols-2  sm:grid">
        <UserLandingCard
          href={`/user/${user._id}`}
          icon={(className) => <BiUserCircle {...{ className }} />}
          title={'See profile'}
          desc={'View or edit your the details of your profile.'}
        />
        <UserLandingCard
          href={`/user/create`}
          icon={(className) => <MdPostAdd {...{ className }} />}
          title={'Create post'}
          desc={"Make your first post here if you haven't already."}
        />
        <UserLandingCard
          href={`/discover`}
          icon={(className) => <IoCompassOutline {...{ className }} />}
          title={'Discover'}
          desc={'Find inspiration from other users.'}
        />
      </div>
    </>
  )
}

export default LandingContent

const UserLandingCard = ({
  href,
  title,
  desc,
  icon,
}: {
  href: string
  title: string
  desc: string
  icon: (classList: string) => JSX.Element
}) => {
  return (
    <Link href={href}>
      <a className="group m-10 block max-w-xs space-y-3 rounded-lg bg-white p-6 shadow-lg ring-1 ring-slate-900/5 transition-colors hover:bg-brand-600 hover:ring-brand-600">
        <div className="flex items-center space-x-3">
          {icon('h-6 w-6 text-brand-600 group-hover:text-white')}
          <h3 className="text-md font-semibold group-hover:text-white">
            {title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 group-hover:text-white">{desc}</p>
      </a>
    </Link>
  )
}
