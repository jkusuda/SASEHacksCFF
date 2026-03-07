import { Sidebar, Heading, CardWindow } from '../components'

const boxShadow = '4px 4px 0 0 #000'

const MOCK_CARDS = [
  {
    website: 'NETFLIX.com',
    amountPerMonth: '$7.99/mo',
    cardNumber: '****.***.-1234',
    renewalDate: '01/20',
    balance: '$14',
    limit: '$21',
  },
  {
    website: 'SPOTIFY.com',
    amountPerMonth: '$9.99/mo',
    cardNumber: '****.***.-5678',
    renewalDate: '02/15',
    balance: '$9.99',
    limit: '$15',
  },
  {
    website: 'DISNEY+.com',
    amountPerMonth: '$10.99/mo',
    cardNumber: '****.***.-9012',
    renewalDate: '03/01',
    balance: '$10.99',
    limit: '$25',
  },
  {
    website: 'HBO MAX.com',
    amountPerMonth: '$14.99/mo',
    cardNumber: '****.***.-3456',
    renewalDate: '01/28',
    balance: '$14.99',
    limit: '$20',
  },
  {
    website: 'YOUTUBE.com',
    amountPerMonth: '$11.99/mo',
    cardNumber: '****.***.-2468',
    renewalDate: '03/15',
    balance: '$11.99',
    limit: '$15',
  },
]

export default function VirtualCards() {
  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-0 ml-[clamp(14rem,24vw,20rem)] p-[clamp(1.5rem,4vw+1rem,3rem)] overflow-auto">
        <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
          Control Center
        </Heading>

        {/* Your active cards - full width so cards spread evenly left to right */}
        <div className="w-full">
          <div className="flex items-center w-full">
            <button
              type="button"
              className="bg-brand-magenta text-white font-semibold text-lg px-4 py-2.5 border-4 border-black cursor-pointer shrink-0"
              style={{ boxShadow }}
            >
              Your active cards
            </button>
            <div className="flex-1 h-px border-t-4 border-black min-w-0" />
            <div
              className="bg-brand-purple/50 border-4 border-black px-6 py-4 min-w-[120px] text-center shrink-0 ml-4"
              style={{ boxShadow }}
            >
              <div className="text-xl font-semibold text-black/80">Active cards</div>
              <span className="font-bold text-xl sm:text-2xl">{MOCK_CARDS.length}</span>
            </div>
          </div>

          {/* Grid: as many columns as fit (min 220px each), then wrap; evenly spaced */}
          <div
            className="mt-6 grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}
          >
            {MOCK_CARDS.map((card, index) => (
              <CardWindow key={`${card.website}-${index}`} card={card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
