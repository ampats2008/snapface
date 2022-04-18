import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className='mx-auto grid place-items-center h-[50vh]'><InfinitySpin color={'#008e56'} width={'200'}/></div>
  )
}

export default Loading