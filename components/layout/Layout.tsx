import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NavLink } from './NavLink'
import { useEffect, useRef, useState } from 'react'
import { Router, useRouter } from 'next/router'
import { BiRightArrowAlt } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { IoExitOutline } from 'react-icons/io5'
import { MdOutlinePostAdd } from 'react-icons/md'
import { useSession, signOut } from 'next-auth/react'
import { ProfilePicture, Snackbar } from '..'
import MenuItem from '../comment/MenuItem'
import { GoGear } from 'react-icons/go'
import { Session } from 'next-auth/core/types'
import { pageInOut } from '../../utils/animations'
import { AnimatePresence, motion } from 'framer-motion'

type LayoutProps = {
  router: Router
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ router: routerProp, children }) => {
  const router = useRouter()
  const { data: session, status } = useSession()

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
          // relative z-10 places header on top of the body in the stacking order
          // (allows our drop down for ProfileMenu to lay ontop of any body content)
          'relative z-10 flex flex-wrap justify-center drop-shadow-sm xl:justify-between'
        }
      >
        <div id="logoCont">
          <Link href={status === 'authenticated' ? '/user/welcome' : '/'}>
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
          <NavLink
            name="Home"
            link={status === 'authenticated' ? '/user/welcome' : '/'}
          />
          <NavLink name="Discover" link="/discover" />
          {/* Don't show Sign-in button if user isLoggedIn or if user is on login page  */}
          {router.pathname !== '/auth/signin' && status === 'unauthenticated' && (
            <Link href={'/auth/signin'}>
              <a className="btn-primary flex items-center rounded-full">
                Sign in{' '}
                <BiRightArrowAlt className="ml-1 inline-block h-5 w-5" />
              </a>
            </Link>
          )}

          {status === 'authenticated' && session && (
            <ProfileMenu {...{ session, status }} />
          )}
        </nav>
      </header>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          id="mainContainer"
          className={'min-h-[80vh]'}
          {...pageInOut}
          key={routerProp.route}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Snackbar />
      <footer className={'mt-10 bg-brand-600 p-10 text-center text-white'}>
        <p>Copyright &#169; 2022 Anthony Medugno.</p>
      </footer>
    </>
  )
}

export default Layout

type Props = {
  session: Session
  status: 'loading' | 'unauthenticated' | 'authenticated'
}

const ProfileMenu = ({ session, status }: Props) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const router = useRouter()
  console.log(session)
  return (
    <div className="relative flex items-center">
      <ProfilePicture
        user={session.user}
        displayName={`${session.user.firstName} ${session.user.lastName}`}
        customClickHandler={() => setMenuOpened((prev) => !prev)}
      />
      {menuOpened && (
        <div
          id="dropdown"
          className="absolute top-12 right-0 z-10 w-max rounded-lg bg-gray-100 p-1 shadow-sm"
        >
          <MenuItem
            onClick={() => {
              router.push(`/user/${session.user.id}`)
              setMenuOpened(false)
            }}
            className={'justify-end hover:bg-blue-100'}
          >
            My Profile{' '}
            <FaUserCircle className="ml-2 inline-block h-5 w-5 text-blue-500" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push(`/user/create/`)
              setMenuOpened(false)
            }}
            className={'justify-end hover:bg-brand-100'}
          >
            Create Post{' '}
            <MdOutlinePostAdd className="ml-2 inline-block h-5 w-5 text-brand-500" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push(`/user/settings/`)
              setMenuOpened(false)
            }}
            className={'justify-end hover:bg-gray-200'}
          >
            Settings{' '}
            <GoGear className="ml-2 inline-block h-5 w-5 text-gray-500" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut({ callbackUrl: '/' })
              setMenuOpened(false)
            }}
            className={'justify-end hover:bg-red-100'}
          >
            Log Out{' '}
            <IoExitOutline className="ml-2 inline-block h-5 w-5 text-red-500" />
          </MenuItem>
        </div>
      )}
    </div>
  )
}
