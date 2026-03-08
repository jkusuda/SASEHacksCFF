import { useState } from 'react'
import { Heading } from '../components'
import creditMagenta2 from '../assets/credit_magenta2.png'

export default function ManageFunds() {
  const outstandingBalance = 0
  const [editingCard, setEditingCard] = useState(false)

  return (
    <>
      <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
        Manage Funds
      </Heading>

      <div className="relative w-full max-w-3xl mx-auto flex-1 flex flex-col min-h-0 mt-6">
        <div className="relative border-[6px] border-black bg-white z-10 min-h-0 p-3 flex flex-col gap-3 [box-shadow:var(--shadow-big)]">
          {/* Outstanding balance */}
          <section className="w-full">
            <h2 className="font-bold text-black text-[clamp(1.375rem,1.75vw+0.65rem,1.75rem)] mb-0.5">
              Outstanding balance
            </h2>
            <div className="w-full border-b-4 border-black mb-2" />
            <div className="flex flex-wrap items-center gap-16">
              <p className="font-mono text-[clamp(1.5rem,2vw+0.75rem,2.25rem)] font-semibold text-brand-cyan ml-6">
                ${outstandingBalance.toFixed(2)}
              </p>
              <div className="flex flex-col items-start gap-1 mt-2">
                <button
                  type="button"
                  disabled={outstandingBalance <= 0}
                  className="bg-brand-magenta text-white font-semibold px-5 py-2.5 rounded-none text-lg border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay now
                </button>
                <p className="text-black/60 text-sm">
                  Charged on the 1st of each month.
                </p>
              </div>
            </div>
          </section>

          {/* Current payment method — hidden when editing */}
          {!editingCard && (
            <section className="w-full">
              <h2 className="font-bold text-black text-[clamp(1.375rem,1.75vw+0.65rem,1.75rem)] mb-0.5">
                Current payment method
              </h2>
              <div className="w-full border-b-4 border-black mb-3" />
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src={creditMagenta2}
                  alt=""
                  className="w-[clamp(5rem,14vw,8rem)] h-auto object-contain"
                />
                <div>
                  <p className="font-mono text-black font-semibold text-[clamp(1rem,1.25vw+0.5rem,1.375rem)]">
                    Visa •••• 4242
                  </p>
                  <p className="text-black/70 text-[clamp(1rem,1.15vw+0.5rem,1.25rem)] mt-0.5">Expires 12/28</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCard(true)}
                className="mt-3 bg-brand-purple text-white font-semibold px-5 py-2 rounded-none text-base border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity"
              >
                Change payment method
              </button>
            </section>
          )}

          {/* Edit card form — shown when editing; no current card info revealed */}
          {editingCard && (
            <section className="w-full">
              <h2 className="font-bold text-black text-[clamp(1.375rem,1.75vw+0.65rem,1.75rem)] mb-0.5">
                Update payment method
              </h2>
              <div className="w-full border-b-4 border-black mb-3" />
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  setEditingCard(false)
                }}
              >
                <label className="flex flex-col gap-1">
                  <span className="font-semibold text-black">Card number</span>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    className="font-mono border-4 border-black px-3 py-1.5 text-base focus:outline-none focus:ring-0"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="font-semibold text-black">Expire date</span>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="font-mono border-4 border-black px-3 py-1.5 text-base focus:outline-none focus:ring-0"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-semibold text-black">CVC</span>
                    <input
                      type="text"
                      placeholder="•••"
                      className="font-mono border-4 border-black px-3 py-1.5 text-base focus:outline-none focus:ring-0"
                    />
                  </label>
                </div>
                <div className="flex gap-2 mt-0.5">
                  <button
                    type="submit"
                    className="bg-brand-purple text-white font-semibold px-4 py-2 rounded-none text-sm border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCard(false)}
                    className="bg-gray-200 text-black font-semibold px-4 py-2 rounded-none text-sm border-[4px] border-black shadow-[4px_4px_0_0_#000] hover:opacity-90 cursor-pointer transition-opacity"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
