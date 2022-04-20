import Link from 'next/link'

type NavLinkProps = {
  name: string | JSX.Element,
  link: string
}

export const NavLink: React.FC<NavLinkProps> = ({ name, link }) => {
  return (
    <>
      <Link href={link}>
        <a className="my-auto hover:text-brand-400 transition-colors">
          {name}
        </a>
      </Link>
    </>
  )
}
