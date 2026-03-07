import { Link, useLocation } from 'react-router-dom'
import Title from './Title'
import Subheading from './Subheading'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/virtual-cards', label: 'Virtual Cards' },
  { to: '/dashboard/settings', label: 'Settings' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[clamp(20rem,32vw,28rem)] min-h-screen flex flex-col border-r-4 border-black bg-white shrink-0">
      <Link
        to="/"
        className="text-black no-underline px-8 pt-10 pb-6 hover:opacity-90 block"
      >
        <Title as="span" className="!text-[clamp(1.75rem,4vw+1.25rem,2.75rem)] uppercase">
          PROJECT NAME
        </Title>
      </Link>
      <div className="border-t-2 border-black mx-6 w-[calc(100%-3rem)]" />
      <nav className="flex flex-col gap-0 pt-6 px-8">
        {navItems.map(({ to, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              className="py-4 text-black no-underline cursor-pointer font-bold transition-all duration-200 ease-out hover:opacity-80 hover:translate-x-1 hover:bg-black/5 -mx-2 px-2 rounded"
            >
              <Subheading as="span" className="!text-[clamp(1.5rem,2.5vw+0.875rem,2.25rem)] !font-bold">
                {label}
              </Subheading>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto border-t-2 border-black mx-6 w-[calc(100%-3rem)]" />
      <div className="px-8 py-6 text-black font-bold transition-all duration-200 ease-out hover:opacity-80 hover:translate-x-1 hover:bg-black/5 rounded cursor-default">
        <Subheading as="span" className="!text-[clamp(1.5rem,2.5vw+0.875rem,2.25rem)] !font-bold">
          User
        </Subheading>
      </div>
    </aside>
  )
}
