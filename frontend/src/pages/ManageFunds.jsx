import { Heading } from '../components'
import creditMagenta2 from '../assets/credit_magenta2.png'

export default function ManageFunds() {
  const outstandingBalance = 0

  return (
    <>
      <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
        Manage Funds
      </Heading>

      <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col min-h-0 mt-6">
        <div className="relative border-[6px] border-black bg-white z-10 flex-1 min-h-0 p-6 flex flex-col gap-14 [box-shadow:var(--shadow-big)]">
          {/* Outstanding balance */}
          <section className="w-full">
            <h2 className="font-bold text-black text-[clamp(1.75rem,2.5vw+1rem,2.25rem)] mb-2">
              Outstanding balance
            </h2>
            <div className="w-full border-b-4 border-black mb-5" />
            <div className="flex flex-wrap items-center gap-16">
              <p className="font-mono text-[clamp(1.5rem,2.5vw+0.875rem,2.25rem)] font-semibold text-brand-cyan">
                ${outstandingBalance.toFixed(2)}
              </p>
              <div className="flex flex-col items-start gap-1 mt-6">
                <button
                  type="button"
                  disabled={outstandingBalance <= 0}
                  className="bg-brand-magenta text-white font-semibold px-6 py-3 rounded-none text-xl border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay now
                </button>
                <p className="text-black/60 text-sm">
                  Charged on the 1st of each month.
                </p>
              </div>
            </div>
          </section>

          {/* Current payment method */}
          <section className="w-full">
            <h2 className="font-bold text-black text-[clamp(1.75rem,2.5vw+1rem,2.25rem)] mb-2">
              Current payment method
            </h2>
            <div className="w-full border-b-4 border-black mb-6" />
            <div className="flex flex-wrap items-center gap-6">
              <img
                src={creditMagenta2}
                alt=""
                className="w-[clamp(8rem,20vw,12rem)] h-auto object-contain"
              />
              <div>
                <p className="font-mono text-black font-semibold text-[clamp(1.125rem,1.5vw+0.6rem,1.5rem)]">
                  Visa •••• 4242
                </p>
                <p className="text-black/70 text-[clamp(1.125rem,1.5vw+0.6rem,1.375rem)] mt-1">Expires 12/28</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 bg-brand-purple text-white font-semibold px-6 py-3 rounded-none text-xl border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity"
            >
              Change payment method
            </button>
          </section>
        </div>
      </div>
    </>
  )
}
