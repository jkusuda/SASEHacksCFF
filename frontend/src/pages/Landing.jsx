import { Title, Subheading, Navbar } from '../components'
import creditPurple1 from '../assets/credit_purple1.png'
import creditPurple2 from '../assets/credit_purple2.png'
import creditMagenta1 from '../assets/credit_magenta1.png'
import creditMagenta2 from '../assets/credit_magenta2.png'
import creditCyan1 from '../assets/credit_cyan1.png'
import creditCyan2 from '../assets/credit_cyan2.png'

export default function Landing() {
  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center relative px-[clamp(1rem,4vw+0.5rem,3rem)] py-[clamp(3rem,8vw+1rem,5rem)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src={creditPurple1}
            alt=""
            className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
            style={{ top: '18%', left: '12%' }}
          />
          <img
            src={creditPurple2}
            alt=""
            className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
            style={{ top: '18%', right: '12%' }}
          />
          <img
            src={creditMagenta1}
            alt=""
            className="absolute w-[clamp(7rem,18vw+2rem,11rem)] object-contain opacity-90"
            style={{ top: '42%', left: '4%' }}
          />
          <img
            src={creditMagenta2}
            alt=""
            className="absolute w-[clamp(7rem,18vw+2rem,11rem)] object-contain opacity-90"
            style={{ top: '42%', right: '4%' }}
          />
          <img
            src={creditCyan1}
            alt=""
            className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
            style={{ bottom: '22%', left: '12%' }}
          />
          <img
            src={creditCyan2}
            alt=""
            className="absolute w-[clamp(6rem,15vw+2rem,10rem)] object-contain opacity-90"
            style={{ bottom: '22%', right: '12%' }}
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
            <button
              type="button"
              className="bg-brand-cyan text-black font-semibold min-h-[clamp(2.75rem,6vw+1.5rem,3.5rem)] px-[clamp(1.25rem,4vw+0.75rem,4rem)] py-[clamp(0.5rem,1.25vw+0.5rem,1rem)] rounded-none text-[clamp(0.875rem,2vw+0.5rem,1.5rem)] shadow-[clamp(4px,2vw,10px)_clamp(4px,2vw,10px)_0_0_#000] hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              Get Extension
            </button>
            <button
              type="button"
              className="bg-brand-magenta text-white font-semibold min-h-[clamp(2.75rem,6vw+1.5rem,3.5rem)] px-[clamp(1.25rem,4vw+0.75rem,4rem)] py-[clamp(0.5rem,1.25vw+0.5rem,1rem)] rounded-none text-[clamp(0.875rem,2vw+0.5rem,1.5rem)] shadow-[clamp(4px,2vw,10px)_clamp(4px,2vw,10px)_0_0_#000] hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
