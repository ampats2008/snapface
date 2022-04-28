import React, { MouseEventHandler, useEffect } from 'react'
import { User } from '../../types/User'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useUser } from '../../hooks/useUser'
import { GoGear } from 'react-icons/go'
import { useRouter } from 'next/router'

type Props = {
  user: User
}
const ProfileBanner = ({ user }: Props) => {
  const randomBannerUrl =
    'https://source.unsplash.com/1600x900/?nature,photography,technology'

  // TODO: EDIT PROFILE DETAILS:
  // TODO: if the user from useUser matches the user from pageUser, then:
  // TODO: the user is currently logged in and viewing their own profile page.
  // TODO: this means that we should enable the user to edit their profile details and POST them to Sanity.

  const { data: session, status } = useSession()
  // const {
  //   user: currentUser,
  //   isLoading,
  //   isError,
  //   error,
  // } = useUser(session, status) // get the current user using the session.user.id

  const isUsersOwnProfile =
    status === 'authenticated' && user._id === session?.user?.id

  useEffect(() => {
    console.log('session', session)
  }, [session])

  return (
    <section
      className={`relative grid place-content-center bg-black py-16 px-6 text-[#f5f5f5] sm:p-28`}
      style={{
        backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url('${randomBannerUrl}')`,
        backgroundPosition: 'top center, center 40%',
        backgroundSize: 'cover, cover',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <div id="userNameGroup" className="flex items-center">
        <Image
          width="70px"
          height="70px"
          className="inline-block rounded-full border-4 border-white shadow-sm"
          src={
            user.profileImg
              ? user.profileImg
              : 'https://source.unsplash.com/70x70/?nature,photography,technology'
          }
        />
        <div className="ml-4">
          <h1 className=" text-4xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          {user.userName && (
            <p className="mt-1 text-sm text-gray-300">@{user.userName}</p>
          )}
        </div>
      </div>
      <h3 className="mt-5 max-w-[50ch] leading-[1.7]">
        {user.bio
          ? user.bio
          : "You haven't created a bio yet. Edit your profile to add one."}
      </h3>
      {isUsersOwnProfile && <SettingsBtn />}
    </section>
  )
}

export default ProfileBanner

const SettingsBtn = () => {
  const router = useRouter()

  const goToSettingsPage = () => {
    router.push('/user/settings/')
  }

  return (
    <button
      id="SettingsBtn"
      onClick={goToSettingsPage}
      className="group absolute top-4 right-4 flex appearance-none items-center rounded-full bg-gray-50 px-2 py-2 text-gray-900 shadow-sm hover:bg-gray-200 sm:px-4 xl:top-10 xl:right-32"
    >
      <GoGear className="h-6 w-6 fill-gray-900 group-hover:animate-spin" />
      <span className="ml-2 hidden sm:inline">Settings</span>
    </button>
  )
}
