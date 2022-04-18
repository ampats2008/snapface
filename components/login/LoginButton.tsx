import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import {AiOutlineGoogle} from 'react-icons/ai'

import { client } from '../../sanity-scripts/client'
import { useRouter } from 'next/router'

import StyledButton from '../StyledButton'

export const LoginButton = () => {

  const router = useRouter()

  const responseGoogle = (response: GoogleLoginResponse) => {
    // Condition: if the obj is of type GoogleLoginReponseOffline, run the *else* block instead:
    if (response.hasOwnProperty('profileObj')) {
      localStorage.setItem('user', JSON.stringify(response.profileObj))

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

      client.createIfNotExists(doc).then(() => {
        console.log('user created if it didnt exist already')
        router.push('/')
      })
    } else {
      alert(
        `Sorry, your request could not be processed at this time. ${response.code}`
      )
    }
  }

  return (
    <GoogleLogin
      clientId={process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN!}
      render={({ onClick, disabled }) => (
        <StyledButton {...{ onClick, disabled }} ><AiOutlineGoogle className='h-5 w-5 inline-block mr-2'/> Sign in with Google </StyledButton>
      )}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  )
}
