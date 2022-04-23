import React, { Dispatch, SetStateAction } from 'react'
import { Tab } from '..'
import StyledButton from '../StyledButton'

type Props = {
  setFilter: Dispatch<SetStateAction<string>>,
  filter: string
}

const ProfilePostsFilter = ({ setFilter, filter }: Props) => {
  return (
    <div className="my-10 mx-auto  flex w-max gap-5">
      {/* Remake these buttons as tab components with active/inactive state  */}
      <Tab
        onClick={() => setFilter('myPosts')}
        isActive={filter === 'myPosts' ? true : false}
      >
        My Posts
      </Tab>

      <Tab
        onClick={() => setFilter('myLikedPosts')}
        isActive={filter === 'myLikedPosts' ? true : false}
      >
        Liked
      </Tab>
    </div>
  )
}

export default ProfilePostsFilter
