import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NavLink } from './NavLink'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Snapface 🤳</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href={'/db.svg'} />
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
              <h1 className="text-3xl font-bold sm:text-5xl">Snapface 🤳</h1>
            </a>
          </Link>
        </div>
        <nav className="my-10 flex w-full max-w-screen-md flex-wrap justify-evenly">
          <NavLink name="Home" link="/" />
          <NavLink name="Discover" link="/discover" />
          <NavLink name="Login" link="/login" />
        </nav>
      </header>
      <div id="mainContainer" className={'min-h-[100vh]'}>
        {children}
      </div>
      <footer className={'mt-10 bg-brand-600 p-10 text-center text-white'}>
        <p>Copyright &#169; 2022 Anthony Medugno.</p>
      </footer>
    </>
  )
}

export default Layout