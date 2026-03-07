import { Title, Subheading, Navbar } from './components'
import creditPurple1 from './assets/credit_purple1.png'
import creditPurple2 from './assets/credit_purple2.png'
import creditMagenta1 from './assets/credit_magenta1.png'
import creditMagenta2 from './assets/credit_magenta2.png'
import creditCyan1 from './assets/credit_cyan1.png'
import creditCyan2 from './assets/credit_cyan2.png'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      {/* Main hero */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 sm:px-8 md:px-12 py-16 sm:py-20 overflow-hidden">
        {/* Credit card images */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src={creditPurple1}
            alt=""
            className="absolute w-32 sm:w-40 object-contain opacity-90"
            style={{ top: '18%', left: '12%' }}
          />
          <img
            src={creditPurple2}
            alt=""
            className="absolute w-32 sm:w-40 object-contain opacity-90"
            style={{ top: '18%', right: '12%' }}
          />
          <img
            src={creditMagenta1}
            alt=""
            className="absolute w-36 sm:w-44 object-contain opacity-90"
            style={{ top: '42%', left: '4%' }}
          />
          <img
            src={creditMagenta2}
            alt=""
            className="absolute w-36 sm:w-44 object-contain opacity-90"
            style={{ top: '42%', right: '4%' }}
          />
          <img
            src={creditCyan1}
            alt=""
            className="absolute w-32 sm:w-40 object-contain opacity-90"
            style={{ bottom: '22%', left: '12%' }}
          />
          <img
            src={creditCyan2}
            alt=""
            className="absolute w-32 sm:w-40 object-contain opacity-90"
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
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8">
            <button
              type="button"
              className="bg-brand-cyan text-black font-semibold px-16 py-3.5 rounded-none text-2xl shadow-[10px_10px_0_0_#000] hover:opacity-90 hover:shadow-[8px_8px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              Get Extension
            </button>
            <button
              type="button"
              className="bg-brand-magenta text-white font-semibold px-16 py-3.5 rounded-none text-2xl shadow-[10px_10px_0_0_#000] hover:opacity-90 hover:shadow-[8px_8px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
