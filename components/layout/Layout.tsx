import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NavLink } from './NavLink'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { BiRightArrowAlt } from 'react-icons/bi'
import { useUser } from '../../hooks/useUser'
import { IoExitOutline } from 'react-icons/io5'
import StyledButton from '../StyledButton'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { user, isLoggedIn } = useUser()

  const handleLogOut = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Snapface 🖐</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href={'/favicon.ico'} />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header
        className={
          'flex flex-wrap justify-center drop-shadow-sm xl:justify-between'
        }
      >
        <div id="logoCont">
          <Link href="/">
            <a className="my-10 flex items-center justify-center px-10 transition-opacity hover:opacity-60">
              <h1 className="text-3xl font-bold sm:text-5xl">
                <span className="brand-gradient bg-clip-text text-transparent">
                  Snap
                </span>
                face🖐
              </h1>
            </a>
          </Link>
        </div>
        <nav className="my-auto flex w-full max-w-screen-md flex-wrap justify-evenly">
          <NavLink name="Home" link="/" />
          <NavLink name="Discover" link="/discover" />
          {/* Don't show Sign-in button if user isLoggedIn or if user is on login page  */}
          {router.pathname !== '/login' && !isLoggedIn && (
            <Link href={'/login'}>
              <a className="btn-primary flex items-center rounded-full">
                Sign in{' '}
                <BiRightArrowAlt className="ml-1 inline-block h-5 w-5" />
              </a>
            </Link>
          )}
          
          {isLoggedIn && (
            <NavLink name="My Profile" link={`/user/${user?._id}`} />
          )}

          {isLoggedIn && (
            <StyledButton onClick={handleLogOut} disabled={false}>
              Log out <IoExitOutline className="ml-2 inline-block h-5 w-5" />
            </StyledButton>
          )}
        </nav>
      </header>
      <div id="mainContainer" className={'min-h-[80vh]'}>
        {children}
      </div>
      <footer className={'mt-10 bg-brand-600 p-10 text-center text-white'}>
        <p>Copyright &#169; 2022 Anthony Medugno.</p>
      </footer>
    </>
  )
}

export default Layout
