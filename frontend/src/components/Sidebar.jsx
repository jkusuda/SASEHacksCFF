import { Link, useLocation, useNavigate } from 'react-router-dom'
import Title from './Title'
import Subheading from './Subheading'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', activeClass: 'bg-brand-purple/25 border-4 border-black' },
  { to: '/dashboard/virtual-cards', label: 'Virtual Cards', activeClass: 'bg-brand-magenta/25 border-4 border-black' },
  { to: '/dashboard/manage-funds', label: 'Manage Funds', activeClass: 'bg-brand-cyan/25 border-4 border-black' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-[clamp(16rem,26vw,22rem)] flex flex-col border-r-4 border-black bg-white z-10">
      <Link
        to="/"
        className="text-black no-underline px-8 pt-10 pb-6 hover:opacity-90 block"
      >
        <Title as="span" className="!text-[clamp(1.5rem,3.5vw+1rem,2.25rem)] uppercase">
          SUBSCRIPTOS
        </Title>
      </Link>
      <div className="border-t-2 border-black mx-6 w-[calc(100%-3rem)]" />
      <nav className="flex flex-col gap-0 pt-6 px-8">
        {navItems.map(({ to, label, activeClass }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              className={`py-4 text-black no-underline cursor-pointer font-bold transition-all duration-200 ease-out -mx-2 px-2 rounded-none border-4 ${
                isActive
                  ? activeClass
                  : 'border-transparent hover:opacity-80 hover:translate-x-1 hover:bg-black/5'
              }`}
            >
              <Subheading as="span" className="!text-[clamp(1.25rem,2vw+0.75rem,1.875rem)] !font-bold">
                {label}
              </Subheading>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto border-t-2 border-black mx-6 w-[calc(100%-3rem)]" />
      <div className="px-8 py-6 flex flex-col gap-3 min-w-0 overflow-visible">
        <Subheading as="span" className="!text-[clamp(1.125rem,1.75vw+0.5rem,1.5rem)] !font-bold text-black">
          User
        </Subheading>
        <p className="text-black font-bold text-[clamp(0.9375rem,1.15vw+0.5rem,1.125rem)] truncate min-w-0" title={user?.email ?? ''}>
          {user?.email ?? 'Not signed in'}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left font-bold text-[clamp(0.8125rem,1vw+0.45rem,1rem)] py-2 px-2 rounded-none bg-brand-purple text-white border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
