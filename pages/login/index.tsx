import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {LoginButton} from '../../components/login/LoginButton'

const Login: NextPage = () => {
  // Define custom login button here:
  // I expect to be able to pass this into a component
  // as a render prop to alter its appearance.

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="mb-10 text-4xl font-bold">Login here!</h1>
      <LoginButton />
    </main>
  )
}

export default Login
