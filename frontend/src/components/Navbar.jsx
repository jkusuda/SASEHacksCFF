import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { user, signOut } = useAuth()
  return (
    <header className="flex items-stretch justify-between pl-[clamp(1rem,3vw+0.5rem,3rem)] pr-0 border-2 border-black">
      <Link
        to="/"
        className="font-bold text-[clamp(1.25rem,3vw+1rem,3rem)] tracking-tight flex items-center gap-2 py-[clamp(0.75rem,2vw+0.5rem,1.25rem)] text-black no-underline hover:opacity-90"
      >
        <img src={logo} alt="" className="h-[1.2em] w-auto object-contain" />
        SUBSCRIPTOS
      </Link>
      <nav className="flex items-stretch">
        {user ? (
          <button
            onClick={async () => {
              await signOut()
            }}
            className="font-medium text-[clamp(0.875rem,1.5vw+0.75rem,1.875rem)] hover:opacity-80 flex items-center justify-center bg-white px-[clamp(1rem,2vw+0.5rem,2rem)] self-stretch min-h-0 cursor-pointer text-black no-underline"
          >
            Log out
          </button>
        ) : (
          <Link
            to="/login"
            className="font-medium text-[clamp(0.875rem,1.5vw+0.75rem,1.875rem)] hover:opacity-80 flex items-center justify-center bg-white px-[clamp(1rem,2vw+0.5rem,2rem)] self-stretch min-h-0 cursor-pointer text-black no-underline"
          >
            Log in
          </Link>
        )}
        <a
          href="/subscriptos-extension.zip"
          download="subscriptos-extension.zip"
          className="bg-brand-magenta text-white font-semibold text-[clamp(0.875rem,1.5vw+0.75rem,1.875rem)] border-r border-black px-[clamp(1rem,2vw+0.5rem,3rem)] rounded-none shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center self-stretch min-h-0 cursor-pointer no-underline"
        >
          Get Extension
        </a>
      </nav>
    </header>
  )
}
