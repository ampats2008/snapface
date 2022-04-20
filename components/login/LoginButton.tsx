import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { AiOutlineGoogle } from 'react-icons/ai'

import { client } from '../../sanity-scripts/client'
import { useRouter } from 'next/router'

import StyledButton from '../StyledButton'

export const LoginButton = () => {
  const router = useRouter()

  const responseGoogle = (response: GoogleLoginResponse) => {
    // Condition: if the obj is of type GoogleLoginReponseOffline, run the *else* block instead:
    if (response.hasOwnProperty('profileObj')) {
      localStorage.setItem('user', JSON.stringify(response.profileObj))

      // Get props of API response object to create a user for Sanity
      const { givenName, familyName, email, googleId, imageUrl } =
        response.profileObj

      // Create document object for User and pass to Sanity
      const doc = {
        _id: googleId,
        _type: 'user',
        email: email,
        firstName: givenName,
        lastName: familyName,
        profileImg: imageUrl,
      }

      // Push document to Sanity, redirect user to welcome page if successful
      client.createIfNotExists(doc)
        .then(() => {
          router.push('/user/welcome')
        })
        .catch(() =>
          alert(
            `Sorry, our servers could not process your request at this time. Please try again later.`
          )
        )
    } else {
      alert(
        `Sorry, your request could not be processed by Google at this time. Please try again.`
      )
    }
  }

  return (
    <GoogleLogin
      clientId={process.env.GOOGLE_ID!}
      render={({ onClick, disabled }) => (
        <StyledButton {...{ onClick, disabled }}>
          <AiOutlineGoogle className="mr-2 inline-block h-5 w-5" /> Sign in with
          Google{' '}
        </StyledButton>
      )}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  )
}
