import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, Linkedin, Github } from 'lucide-react'
import { Title, Subheading } from '../components'
import { useAuth } from '../contexts/AuthContext'
import creditPurple1 from '../assets/credit_purple1.png'
import creditPurple2 from '../assets/credit_purple2.png'
import creditMagenta1 from '../assets/credit_magenta1.png'
import creditMagenta2 from '../assets/credit_magenta2.png'
import creditCyan1 from '../assets/credit_cyan1.png'
import creditCyan2 from '../assets/credit_cyan2.png'
import asher from '../assets/asher.jpg'
import jordan from '../assets/jordan.jpg'
import kenzo from '../assets/kenzo.jpg'
import lucas from '../assets/lucas.jpg'

const CARD_TRANSITION = 'transform 0.2s ease-out'

export default function Landing() {
  const { user } = useAuth()
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    function handleMove(e) {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    function handleScroll() {
      if (window.scrollY > 50) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Normalized offset from center (-0.5 to 0.5), larger scale = more movement
  const cx = (mouse.x - 0.5) * 48
  const cy = (mouse.y - 0.5) * 48
  const vy = 1 // same vertical constant for all; some cards use -cy for inverted

  return (
    <>
      <main className="flex-1 flex flex-col w-full">
        {/* --- Hero Section --- */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-[clamp(1rem,4vw+0.5rem,3rem)] pt-[clamp(1.5rem,5vw+0.5rem,3rem)] pb-[clamp(3rem,8vw+1rem,5rem)] overflow-hidden bg-[#ffffff]">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <img
              src={creditPurple1}
              alt=""
              className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
              style={{
                top: '18%',
                left: '12%',
                transform: `translate(${cx * 0.9}px, ${cy * vy}px)`,
                transition: CARD_TRANSITION,
              }}
            />
            <img
              src={creditPurple2}
              alt=""
              className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
              style={{
                top: '18%',
                right: '12%',
                transform: `translate(${-cx * 1.2}px, ${cy * vy}px)`,
                transition: CARD_TRANSITION,
              }}
            />
            <img
              src={creditMagenta1}
              alt=""
              className="absolute w-[clamp(7rem,18vw+2rem,11rem)] object-contain opacity-90"
              style={{
                top: '42%',
                left: '4%',
                transform: `translate(${-cx * 0.75}px, ${cy * vy}px)`,
                transition: CARD_TRANSITION,
              }}
            />
            <img
              src={creditMagenta2}
              alt=""
              className="absolute w-[clamp(7rem,18vw+2rem,11rem)] object-contain opacity-90"
              style={{
                top: '42%',
                right: '4%',
                transform: `translate(${cx * 1.1}px, ${-cy * vy}px)`,
                transition: CARD_TRANSITION,
              }}
            />
            <img
              src={creditCyan1}
              alt=""
              className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
              style={{
                bottom: '22%',
                left: '12%',
                transform: `translate(${-cx * 1.05}px, ${-cy * vy}px)`,
                transition: CARD_TRANSITION,
              }}
            />
            <img
              src={creditCyan2}
              alt=""
              className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
              style={{
                bottom: '22%',
                right: '12%',
                transform: `translate(${cx * 0.65}px, ${cy * vy}px)`,
                transition: CARD_TRANSITION,
              }}
            />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <Title className="text-black leading-tight">
              A Firewall For
              <br />
              Your Finances
            </Title>
            <Subheading as="p" mono className="mt-6 text-black/90 max-w-4xl mx-auto">
              Block sneaky subscriptions. We find the ToS traps and generate burner cards to keep your wallet safe.
            </Subheading>
            <div className="mt-[clamp(1.5rem,5vw+1rem,2.5rem)] flex flex-col sm:flex-row items-center justify-center gap-[clamp(0.75rem,3vw+0.5rem,2rem)]">
              <a
                href="/subscriptos-extension.zip"
                download="subscriptos-extension.zip"
                className="inline-flex items-center justify-center bg-brand-cyan text-black font-semibold min-h-[clamp(2.75rem,6vw+1.5rem,3.5rem)] px-[clamp(1.25rem,4vw+0.75rem,4rem)] py-[clamp(0.5rem,1.25vw+0.5rem,1rem)] rounded-none text-[clamp(0.875rem,2vw+0.5rem,1.5rem)] shadow-[clamp(4px,2vw,10px)_clamp(4px,2vw,10px)_0_0_#000] hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
              >
                Get Extension
              </a>
              <Link
                to={user ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center bg-brand-magenta text-white font-semibold min-h-[clamp(2.75rem,6vw+1.5rem,3.5rem)] px-[clamp(1.25rem,4vw+0.75rem,4rem)] py-[clamp(0.5rem,1.25vw+0.5rem,1rem)] rounded-none text-[clamp(0.875rem,2vw+0.5rem,1.5rem)] shadow-[clamp(4px,2vw,10px)_clamp(4px,2vw,10px)_0_0_#000] hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
              >
                {user ? 'Open Dashboard' : 'Get Started'}
              </Link>
            </div>
          </div>

          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 flex flex-col items-center ${hasScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100'}`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">Scroll to Meet the Team</span>
            <ArrowDown className="w-5 h-5 text-black animate-bounce" />
          </div>
        </section>

        {/* --- About Section --- */}
        <section className="relative w-full bg-white py-24 px-6 sm:px-12 z-20">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-4xl sm:text-5xl font-bold uppercase tracking-widest text-black mb-16 text-center"
              style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
            >
              Meet The Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="bg-brand-purple border-4 border-black p-8 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200">
                <div className="w-32 h-32 bg-white border-4 border-black rounded-full mb-6 shadow-[4px_4px_0_0_#000] overflow-hidden flex items-center justify-center bg-gray-100 relative group">
                  <img src={kenzo} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
                  <span className="text-gray-400 font-bold uppercase text-xs">Photo 1</span>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-black">Kenzo Fukuda</h3>
                  <a href="https://www.linkedin.com/in/kenzo-fukuda/" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#0077B5] border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
                <p className="font-mono text-sm font-bold text-black/80 mt-2">Frontend & UI/UX</p>
              </div>

              {/* Card 2 */}
              <div className="bg-brand-cyan border-4 border-black p-8 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200">
                <div className="w-32 h-32 bg-white border-4 border-black rounded-full mb-6 shadow-[4px_4px_0_0_#000] overflow-hidden flex items-center justify-center bg-gray-100 relative group">
                  <img src={jordan} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
                  <span className="text-gray-400 font-bold uppercase text-xs">Photo 2</span>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-black">Jordan Kusuda</h3>
                  <a href="https://www.linkedin.com/in/jordankusuda/" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#0077B5] border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
                <p className="font-mono text-sm font-bold text-black/80 mt-2">Extension & Backend</p>
              </div>

              {/* Card 3 */}
              <div className="bg-brand-magenta border-4 border-black p-8 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200">
                <div className="w-32 h-32 bg-white border-4 border-black rounded-full mb-6 shadow-[4px_4px_0_0_#000] overflow-hidden flex items-center justify-center bg-gray-100 relative group">
                  <img src={lucas} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
                  <span className="text-gray-400 font-bold uppercase text-xs">Photo 3</span>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-black">Lucas Kilday</h3>
                  <a href="https://www.linkedin.com/in/lucas-kilday/" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#0077B5] border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
                <p className="font-mono text-sm font-bold text-black/90 mt-2">Stripe API</p>
              </div>

              {/* Card 4 */}
              <div className="bg-yellow-400 border-4 border-black p-8 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200">
                <div className="w-32 h-32 bg-white border-4 border-black rounded-full mb-6 shadow-[4px_4px_0_0_#000] overflow-hidden flex items-center justify-center bg-gray-100 relative group">
                  <img src={asher} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
                  <span className="text-gray-400 font-bold uppercase text-xs">Photo 4</span>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-black">Asher Wheatle</h3>
                  <a href="https://www.linkedin.com/in/asher-wheatle/" target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#0077B5] border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
                <p className="font-mono text-sm font-bold text-black/80 mt-2">Gemini API</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="w-full py-8 px-6 flex flex-col items-center justify-center z-20">
          <a
            href="https://github.com/jkusuda/SASEHacksCFF"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-black hover:-translate-y-1 hover:opacity-75 transition-all"
          >
            <Github className="w-5 h-5" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-60">
              View on GitHub
            </span>
          </a>
        </footer>
      </main>
    </>
  )
}
