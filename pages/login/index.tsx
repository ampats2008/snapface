import type { NextPage } from 'next'
import {LoginButton} from '../../components/login/LoginButton'

const Login: NextPage = () => {

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="mb-10 text-4xl font-bold">Please log in here</h1>
      <LoginButton />
    </main>
  )
}

export default Login
