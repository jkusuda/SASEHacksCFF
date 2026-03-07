import { useState, useRef, useEffect } from 'react'
import { Paperclip } from 'lucide-react'
import { Sidebar, Heading } from '../components'
import creditMagenta2 from '../assets/credit_magenta2.png'
import creditMagenta3 from '../assets/credit_magenta3.png'
import creditCyan1 from '../assets/credit_cyan1.png'
import creditCyan3 from '../assets/credit_cyan3.png'

const UPLOAD_ANIM_MS = 280
const UPLOAD_UNMOUNT_MS = 320

export default function Dashboard() {
  const [tosText, setTosText] = useState('')
  const [uploadAnimatingOut, setUploadAnimatingOut] = useState(false)
  const [uploadApplyOut, setUploadApplyOut] = useState(false)
  const [uploadAnimatingIn, setUploadAnimatingIn] = useState(false)
  const [uploadApplyIn, setUploadApplyIn] = useState(true)
  const uploadTimeoutRef = useRef(null)

  const hasText = !!tosText.trim()

  const handleTosChange = (e) => {
    const next = e.target.value
    const wasEmpty = !tosText.trim()
    setTosText(next)
    if (wasEmpty && next.trim()) {
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current)
      setUploadAnimatingIn(false)
      setUploadApplyIn(true)
      setUploadAnimatingOut(true)
      setUploadApplyOut(false)
      uploadTimeoutRef.current = setTimeout(() => {
        setUploadAnimatingOut(false)
        setUploadApplyOut(false)
        uploadTimeoutRef.current = null
      }, UPLOAD_UNMOUNT_MS)
    } else if (!wasEmpty && !next.trim()) {
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current)
      setUploadAnimatingOut(false)
      setUploadApplyOut(false)
      setUploadAnimatingIn(true)
      setUploadApplyIn(false)
      uploadTimeoutRef.current = setTimeout(() => {
        setUploadAnimatingIn(false)
        setUploadApplyIn(true)
        uploadTimeoutRef.current = null
      }, UPLOAD_UNMOUNT_MS)
    }
  }

  useEffect(() => {
    if (!uploadAnimatingOut) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setUploadApplyOut(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [uploadAnimatingOut])

  useEffect(() => {
    if (!uploadAnimatingIn) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setUploadApplyIn(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [uploadAnimatingIn])

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-0 ml-[clamp(14rem,24vw,20rem)] p-[clamp(1.5rem,4vw+1rem,3rem)] relative overflow-hidden">
        <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">Dashboard</Heading>

        <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col min-h-0 max-h-[55vh] mt-6">
          {/* Credit cards around the box */}
          <img
            src={creditCyan1}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 -top-4 -right-12 z-10"
          />
          <img
            src={creditMagenta2}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 top-1/2 -translate-y-1/2 -right-12 z-10"
          />
          <img
            src={creditMagenta3}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 top-[25%] -translate-y-1/2 -left-12 z-0"
          />
          <img
            src={creditCyan3}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 top-[65%] -translate-y-1/2 -left-12 z-0"
          />

          {/* Main feature box */}
          <div className="relative border-[6px] border-black bg-white p-8 flex-1 min-h-0 flex flex-col z-10">
            <textarea
              value={tosText}
              onChange={handleTosChange}
              placeholder="Copy Terms of Service here to analyze..."
              className="w-full flex-1 min-h-[180px] font-mono text-[clamp(1.125rem,1.75vw+0.75rem,1.5rem)] border-0 resize-none focus:outline-none focus:ring-0 placeholder:text-black/50 placeholder:text-[clamp(1.125rem,1.75vw+0.75rem,1.5rem)]"
              aria-label="Terms of Service input"
            />
            {/* Footer: overflow so label clips at border when sliding down */}
            <div className="relative mt-4 flex shrink-0 flex-col overflow-hidden" style={{ paddingBottom: '2rem', marginBottom: '-2rem' }}>
              <div className="flex items-center justify-between pt-4 min-h-[3.5rem]">
                {(!hasText || uploadAnimatingOut) && (
                  <label
                    className={`flex items-center gap-3 font-sans font-semibold text-[clamp(1.125rem,1.75vw+0.75rem,1.5rem)] text-black cursor-pointer hover:opacity-80 transition-all ease-out ${
                      uploadAnimatingOut
                        ? (uploadApplyOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100')
                        : uploadAnimatingIn
                          ? (uploadApplyIn ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')
                          : 'translate-y-0 opacity-100'
                    }`}
                    style={{ transitionDuration: `${UPLOAD_ANIM_MS}ms` }}
                  >
                    <Paperclip aria-hidden className="shrink-0 w-[1em] h-[1em]" strokeWidth={2.5} />
                    Upload File
                    <input type="file" className="hidden" accept=".txt,.pdf" />
                  </label>
                )}
                <button
                  type="button"
                  className={`bg-brand-purple text-white font-semibold px-8 py-3.5 rounded-none text-[clamp(1.25rem,2vw+0.875rem,1.75rem)] border-[6px] border-black shadow-[8px_8px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity ${hasText ? 'ml-auto' : ''}`}
                >
                  Start Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
