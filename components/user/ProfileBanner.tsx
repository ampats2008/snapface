import React from 'react'
import { User } from '../../types/User'
import Image from 'next/image'

type Props = {
  user: User
}
const ProfileBanner = ({ user }: Props) => {
  const randomBannerUrl =
    'https://source.unsplash.com/1600x900/?nature,photography,technology'

  return (
    <section
      className={`grid place-content-center bg-black p-4 text-[#f5f5f5] xl:min-h-[350px] xl:p-5`}
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
          src={user.profileImg}
        />
        <div className="ml-4">
          <h1 className=" text-4xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          {(user.userName) && <p className="mt-1 text-sm text-gray-300">@{user.userName}</p>}
        </div>
      </div>
      <h3 className="mt-5 max-w-[50ch] leading-[1.7]">{(user.bio) ? user.bio : "You haven't created a bio yet. Edit your profile to add one."}</h3>
    </section>
  )
}

export default ProfileBanner
