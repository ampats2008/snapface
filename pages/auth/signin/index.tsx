import type { NextPage, NextPageContext } from 'next'
import { signIn, getProviders } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import {
  AiOutlineGoogle,
  // AiOutlineGithub,
  // AiOutlineTwitter,
  // AiOutlineFacebook,
} from 'react-icons/ai'
import { StyledButton } from '../../../components'
import { ErrorNotification } from '../../../components/create-post/Notifications'

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

type Props = {
  providers: Provider[]
}

const Login: NextPage<Props> = ({ providers }) => {
  const { error } = useRouter().query // Next-auth passes login errors as query string params: https://next-auth.js.org/configuration/pages#sign-in-page
  // Compute error message based on 'error'
  const errorMsgMap: { [error: string]: string } = {
    Default: 'Sorry, something went wrong. Please try to sign in again.',
    SessionRequired:
      'The content of this page requires you to be signed in at all times.',
    CredentialsSignin: 'Your credentials were incorrect. Please try again.',
    EmailSignin:
      'Sending the e-mail with the verification token failed. Please refresh the page and try to sign up again.',
    OAuthAccountNotLinked:
      'Your email has already been linked to a different account with the same service! (E.g. If you tried to sign in with Google, your Google account has already been linked to a different user on this website.)',
    Callback: 'Something went wrong in the OAuth callback handler route',
    EmailCreateAccount: 'Could not create email provider user in the database.',
    OAuthCreateAccount: 'Could not create OAuth provider user in the database.',
    OAuthCallback: 'Error in handling the response from an OAuth provider.',
    OAuthSignin: 'Error in constructing an authorization URL.',
  }

  const logoClasses = 'mr-2 inline-block h-5 w-5'
  const providerLogoMap: { [providerId: string]: JSX.Element } = {
    google: <AiOutlineGoogle className={logoClasses} />,
    // github: <AiOutlineGithub className={logoClasses} />,
    // twitter: <AiOutlineTwitter className={logoClasses} />,
    // facebook: <AiOutlineFacebook className={logoClasses} />,
  }

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="mb-10 text-4xl font-bold">Please login below</h1>
      {/* Print error if one exists: */}
      {error && typeof error === 'string' && (
        <ErrorNotification>{errorMsgMap[error]}</ErrorNotification>
      )}
      {Object.values(providers).map((provider) => (
        <StyledButton
          key={provider.name}
          onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          disabled={false}
          roundingClass="rounded-full mb-8"
        >
          {providerLogoMap[provider.id]} Sign in with {provider.name}
        </StyledButton>
      ))}
    </main>
  )
}

export default Login

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
