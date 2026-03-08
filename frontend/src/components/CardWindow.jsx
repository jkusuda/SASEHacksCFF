const boxShadow = '4px 4px 0 0 #000'

export default function CardWindow({ card, className = '' }) {
  const {
    website,
    amountPerMonth,
    cardNumber,
    renewalDate,
    limit,
  } = card

  return (
    <div
      className={`w-full min-w-0 min-h-[400px] border-4 border-black bg-white flex flex-col overflow-hidden ${className}`.trim()}
      style={{ boxShadow }}
    >
      {/* Apple-style window header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-4 border-black bg-gray-100 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-black" />
        <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
      </div>
      {/* Content from card data */}
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <span className="font-bold text-2xl sm:text-3xl shrink-0">{website}</span>
        <div className="flex flex-col gap-2.5 flex-1 min-h-0 mt-2">
          <span className="font-mono text-lg sm:text-xl">{amountPerMonth}</span>
          <div
            className="bg-brand-cyan/30 border-4 border-black px-3 py-2 font-mono text-lg sm:text-xl"
            style={{ boxShadow: '2px 2px 0 0 #000' }}
          >
            {cardNumber}
          </div>
          <div className="mt-auto pt-4 px-4 py-3 font-sans space-y-2">
            <p className="text-lg sm:text-xl"><span className="font-semibold text-black">Expire Date:</span> <span className="font-mono text-black">{renewalDate}</span></p>
            <p className="text-lg sm:text-xl"><span className="font-semibold text-black">Limit:</span> <span className="font-mono text-black">{limit}</span></p>
          </div>
          <button
            type="button"
            className="mt-4 bg-brand-magenta text-white font-semibold px-4 py-2 border-4 border-black w-fit cursor-pointer text-lg sm:text-xl"
            style={{ boxShadow }}
          >
            Cancel Card
          </button>
        </div>
      </div>
    </div>
  )
}
