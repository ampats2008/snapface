import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'

import { client } from '../../sanity-scripts/client'

import { useRouter } from 'next/router'

const Login: NextPage = () => {
  // LOGIC FOR HANDLING GOOGLE LOGIN RESPONSES

  const router = useRouter()

  const responseGoogle = (response: GoogleLoginResponse) => {

    // if the obj is of type GoogleLoginReponseOffline, run the *else* block below:
    if (response.hasOwnProperty('profileObj')) {
      localStorage.setItem('user', JSON.stringify(response.profileObj))
      console.log(response)

      const { givenName, familyName, email, googleId, imageUrl } =
        response.profileObj

      // if response is successful, create document object for User and pass to Sanity
      const doc = {
        _id: googleId,
        _type: 'user',
        email: email,
        firstName: givenName,
        lastName: familyName,
        profileImg: imageUrl,
      }

      client.createIfNotExists(doc)
        .then(() => {
            console.log('user created if it didnt exist already');
            router.push('/')
        })

    } else {
      console.log(
        `Sorry, your request could not be processed at this time. ${response.code}`
      )
    }
  }

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="mb-10 text-4xl font-bold">Login here!</h1>
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN!}
        buttonText={'Sign in with Google'}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </main>
  )
}

export default Login