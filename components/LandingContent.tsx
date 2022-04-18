import Link from 'next/link'

const LandingContent = () => {
  return (
    <>
      <h1 className="text-6xl font-bold">
        Welcome to <span className="text-brand-600"> Snapface.</span>
      </h1>
      <p className="mt-5 text-2xl">
        Get started by logging in{' '}
        <Link href="/login">
          <a className="text-brand-600 hover:underline">here.</a>
        </Link>
      </p>
    </>
  )
}

export default LandingContent