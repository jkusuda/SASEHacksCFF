export default function Navbar() {
  return (
    <header className="flex items-stretch justify-between pl-6 sm:pl-8 md:pl-12 pr-0 border border-black">
      <span className="font-bold text-5xl tracking-tight flex items-center py-5">PROJECT NAME</span>
      <nav className="flex items-stretch">
        <a
          href="#login"
          className="font-medium text-3xl hover:opacity-80 flex items-center justify-center bg-white px-6 sm:px-8 self-stretch min-h-0 cursor-pointer"
        >
          Log in
        </a>
        <button
          type="button"
          className="bg-brand-magenta text-white font-semibold text-3xl border-r border-black px-6 sm:px-8 md:px-12 rounded-none shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center self-stretch min-h-0 cursor-pointer"
        >
          Get Extension
        </button>
      </nav>
    </header>
  )
}
