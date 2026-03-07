import { useState, useRef, useEffect } from 'react'
import { Paperclip } from 'lucide-react'
import { Sidebar, Heading } from '../components'
import creditMagenta2 from '../assets/credit_magenta2.png'
import creditMagenta3 from '../assets/credit_magenta3.png'
import creditCyan1 from '../assets/credit_cyan1.png'
import creditCyan3 from '../assets/credit_cyan3.png'

/** Mock ToS report from backend (matches GET /report shape: { report: { data_privacy, integrity, consumer_fairness } }) */
const MOCK_TOS_REPORT = {
  data_privacy: {
    score: 35,
    justification: 'The terms grant Spotify and its business partners broad, irrevocable licenses to user content and device resources for advertising, while deferring detailed privacy protections to a separate policy.',
  },
  integrity: {
    score: 55,
    justification: 'While major disclaimers are transparently presented, the complex and burdensome pre-arbitration and mass arbitration processes could be seen as designed to deter legitimate consumer disputes.',
  },
  consumer_fairness: {
    score: 15,
    justification: 'The contract contains multiple blatantly predatory clauses, including mandatory individual arbitration, a class action waiver, severe limitations of liability, a jury trial waiver, and highly burdensome dispute resolution procedures.',
  },
}

/** Mock translation (brainrot summary from backend translate) */
const MOCK_TRANSLATION = 'Yo this website lowk sus'

const UPLOAD_ANIM_MS = 280
const FADE_IN_MS = 400
const CHATBOT_SLIDE_MS = 450
const CHATBOT_DELAY_MS = 200
const UPLOAD_UNMOUNT_MS = 320

export default function Dashboard() {
  const [tosText, setTosText] = useState('')
  const [report, setReport] = useState(null)
  const [resultsClosing, setResultsClosing] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [tablesVisible, setTablesVisible] = useState(false)
  const [chatbotVisible, setChatbotVisible] = useState(false)
  const [uploadAnimatingOut, setUploadAnimatingOut] = useState(false)
  const [uploadApplyOut, setUploadApplyOut] = useState(false)
  const [uploadAnimatingIn, setUploadAnimatingIn] = useState(false)
  const [uploadApplyIn, setUploadApplyIn] = useState(true)
  const uploadTimeoutRef = useRef(null)

  const hasText = !!tosText.trim()

  const RESULTS_EXPAND_MS = 800
  const RESULTS_COLLAPSE_MS = 850

  useEffect(() => {
    if (!report) {
      setTablesVisible(false)
      setChatbotVisible(false)
      return
    }
    const raf = requestAnimationFrame(() => {
      setTablesVisible(true)
    })
    const t = setTimeout(() => setChatbotVisible(true), Math.round(RESULTS_EXPAND_MS * 0.5))
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [report])

  useEffect(() => {
    if (!resultsClosing) return
    const t = setTimeout(() => {
      setReport(null)
      setResultsClosing(false)
      setTosText('')
    }, RESULTS_COLLAPSE_MS)
    return () => clearTimeout(t)
  }, [resultsClosing])

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
      <main className="flex-1 flex flex-col min-h-0 ml-[clamp(16rem,26vw,22rem)] p-[clamp(1.5rem,4vw+1rem,3rem)] relative">
        <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">Dashboard</Heading>

        <div className={`relative w-full max-w-6xl mx-auto flex-1 flex flex-col min-h-0 ${report && !resultsClosing ? 'mt-2' : 'mt-6'}`}>
          <img
            key={`credit-cyan1-${report !== null}-${resultsClosing}`}
            src={creditCyan1}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 -top-4 -right-12 z-10 animate-card-spin"
          />
          <img
            key={`credit-magenta2-${report !== null}-${resultsClosing}`}
            src={creditMagenta2}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 top-1/2 -translate-y-1/2 -right-12 z-10 animate-card-spin"
          />
          <img
            key={`credit-magenta3-${report !== null}-${resultsClosing}`}
            src={creditMagenta3}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 top-[25%] -translate-y-1/2 -left-12 z-0 animate-card-spin"
          />
          <img
            key={`credit-cyan3-${report !== null}-${resultsClosing}`}
            src={creditCyan3}
            alt=""
            className="absolute w-[clamp(4rem,10vw+1rem,6rem)] object-contain opacity-90 top-[65%] -translate-y-1/2 -left-12 z-0 animate-card-spin"
          />

          {/* Translation + SCORES: expand on analysis, slow collapse on Start another analysis */}
          {(report || resultsClosing) && (
            <div
              className="flex-shrink-0 mb-2 overflow-hidden ease-out"
              style={{
                maxHeight: tablesVisible && !resultsClosing ? 420 : 0,
                transition: `max-height ${resultsClosing ? RESULTS_COLLAPSE_MS : RESULTS_EXPAND_MS}ms ease-out`,
              }}
            >
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={() => setResultsClosing(true)}
                  className="bg-brand-purple text-white font-semibold px-8 py-3.5 rounded-none text-xl border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity"
                >
                  Start another analysis
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border-[6px] border-black bg-white p-6">
                  <h3 className="font-bold text-black text-3xl mb-2">Translation</h3>
                  <p className="font-mono text-black/90 text-[clamp(1.125rem,1.75vw+0.6rem,1.5rem)]">{MOCK_TRANSLATION}</p>
                </div>
                <div className="border-[6px] border-black bg-white p-6">
                  <h3 className="font-bold text-black text-[1.625rem] mb-2">Scores</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-cyan shrink-0" />
                      <span className="font-semibold text-black text-[clamp(1.125rem,1.75vw+0.6rem,1.5rem)]">Integrity Score: {report.integrity.score}/100</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-magenta shrink-0" />
                      <span className="font-semibold text-black text-[clamp(1.125rem,1.75vw+0.6rem,1.5rem)]">Data Privacy: {report.data_privacy.score}/100</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-purple shrink-0" />
                      <span className="font-semibold text-black text-[clamp(1.125rem,1.75vw+0.6rem,1.5rem)]">Consumer Fairness: {report.consumer_fairness.score}/100</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* One component: ToS view or Start chatting (same layer) */}
          <div className="relative border-[6px] border-black bg-white flex flex-col overflow-hidden z-10 flex-1 min-h-[260px]">
            {!report || resultsClosing ? (
              <div className="flex flex-col flex-1 min-h-0 p-8 pb-4">
                <textarea
                  value={tosText}
                  onChange={handleTosChange}
                  placeholder="Copy Terms of Service here to analyze..."
                  className="w-full flex-1 min-h-[120px] font-mono text-[clamp(1.125rem,1.75vw+0.75rem,1.5rem)] border-0 resize-none focus:outline-none focus:ring-0 placeholder:text-black/50 placeholder:text-[clamp(1.125rem,1.75vw+0.75rem,1.5rem)]"
                  aria-label="Terms of Service input"
                />
                <div className="relative mt-4 flex shrink-0 flex-col overflow-hidden" style={{ paddingBottom: '0.5rem', marginBottom: '-0.5rem' }}>
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
                      onClick={() => setReport(hasText ? MOCK_TOS_REPORT : null)}
                      className="bg-brand-purple text-white font-semibold px-8 py-3.5 rounded-none text-xl border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity ml-auto"
                    >
                      Start Analysis
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (chatInput.trim()) {
                    setChatInput('')
                  }
                }}
                className="flex-1 min-h-0 flex flex-col"
              >
                <div className="flex-1 min-h-0 p-3 flex flex-col">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Start chatting..."
                    className="w-full flex-1 min-h-[56px] font-mono border-0 resize-none focus:outline-none focus:ring-0 placeholder:text-black/40 bg-transparent"
                    style={{ fontSize: 'clamp(1.0625rem, 1.5vw + 0.6rem, 1.3125rem)' }}
                    aria-label="Chat message"
                  />
                </div>
                <div className="flex justify-end px-3 pb-3 flex-shrink-0">
                  <button
                    type="submit"
                    className="bg-brand-cyan text-black font-semibold px-6 py-3 text-base border-4 border-black rounded-none shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer"
                  >
                    Ask
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
