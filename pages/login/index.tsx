import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { AiOutlineGoogle } from 'react-icons/ai'
import { StyledButton } from '../../components'

const Login: NextPage = () => {

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="mb-10 text-4xl font-bold">Please log in here</h1>
      <StyledButton onClick={() => signIn(undefined, { callbackUrl: '/' })} disabled={false}>
        <AiOutlineGoogle className="mr-2 inline-block h-5 w-5" /> Sign in with
        Google{' '}
      </StyledButton>
    </main>
  )
}

export default Login
