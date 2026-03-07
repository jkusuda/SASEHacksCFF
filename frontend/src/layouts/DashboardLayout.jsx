import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from '../components'

const PAGE_TRANSITION_MS = 280

export default function DashboardLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: PAGE_TRANSITION_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 flex flex-col min-h-0 ml-[clamp(16rem,26vw,22rem)] p-[clamp(1.5rem,4vw+1rem,3rem)] relative overflow-auto"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
