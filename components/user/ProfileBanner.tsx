import React, { MouseEventHandler, useEffect } from 'react'
import { User } from '../../types/User'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { GoGear } from 'react-icons/go'
import { useRouter } from 'next/router'
import { buildUrlFor } from '../../sanity-scripts/client'

type Props = {
  user: User
}
const ProfileBanner = ({ user }: Props) => {
  const randomBannerUrl =
    'https://source.unsplash.com/1600x900/?nature,photography,technology'

  const { data: session, status } = useSession()

  const isUsersOwnProfile =
    status === 'authenticated' && user._id === session?.user?.id

  useEffect(() => {
    console.log('user', user)
  }, [user])

  return (
    <section
      className={`relative grid place-content-center bg-black py-16 px-6 text-[#f5f5f5] sm:p-28`}
      style={{
        backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url('${
          user.bannerImg ? buildUrlFor(user.bannerImg).url() : randomBannerUrl
        }')`,
        backgroundPosition: 'top center, center 40%',
        backgroundSize: 'cover, cover',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <div id="userNameGroup" className="flex items-center">
        <div
          id="profilePicture"
          className="grid place-items-center rounded-full border-2 border-white shadow-sm"
        >
          <Image
            width="70px"
            height="70px"
            className="inline-block rounded-full"
            src={
              user.profileImg
                ? user.profileImg
                : 'https://source.unsplash.com/70x70/?nature,photography,technology'
            }
          />
        </div>
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
