export default function Navbar() {
  return (
    <header className="flex items-stretch justify-between pl-[clamp(1rem,3vw+0.5rem,3rem)] pr-0 border border-black">
      <span className="font-bold text-[clamp(1.25rem,3vw+1rem,3rem)] tracking-tight flex items-center py-[clamp(0.75rem,2vw+0.5rem,1.25rem)]">PROJECT NAME</span>
      <nav className="flex items-stretch">
        <a
          href="#login"
          className="font-medium text-[clamp(0.875rem,1.5vw+0.75rem,1.875rem)] hover:opacity-80 flex items-center justify-center bg-white px-[clamp(1rem,2vw+0.5rem,2rem)] self-stretch min-h-0 cursor-pointer"
        >
          Log in
        </a>
        <button
          type="button"
          className="bg-brand-magenta text-white font-semibold text-[clamp(0.875rem,1.5vw+0.75rem,1.875rem)] border-r border-black px-[clamp(1rem,2vw+0.5rem,3rem)] rounded-none shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center self-stretch min-h-0 cursor-pointer"
        >
          Get Extension
        </button>
      </nav>
    </header>
  )
}
