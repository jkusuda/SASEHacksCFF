import { useEffect, useState } from 'react'
import { Heading, CardWindow } from '../components'
import { useAuth } from '../contexts/AuthContext'


const boxShadow = '4px 4px 0 0 #000'


export default function VirtualCards() {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchCards() {
      if (!user) return

      try {
        const res = await fetch('http://localhost:8000/cards/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: user.id,
            email: user.email || ''
          })
        })

        const data = await res.json()

        if (data.data) {
          const formattedCards = data.data.map(c => ({
            id: c.id,
            website: c.metadata?.subscription || c.brand || 'Virtual Card',
            amountPerMonth: c.spending_controls?.spending_limits?.[0]?.amount
              ? `$${(c.spending_controls.spending_limits[0].amount / 100).toFixed(2)}/mo`
              : 'No Limit',
            cardNumber: `****.***.-${c.last4}`,
            renewalDate: `${String(c.exp_month).padStart(2, '0')}/${String(c.exp_year).slice(-2)}`,
            balance: 'N/A',
            limit: c.spending_controls?.spending_limits?.[0]?.amount
              ? `$${(c.spending_controls.spending_limits[0].amount / 100).toFixed(2)}`
              : 'N/A',
          }))
          setCards(formattedCards)
        }
      } catch (err) {
        console.error("Failed to fetch cards:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [user])


  return (
    <>
      <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
        Control Center
      </Heading>


      {/* Your active cards - full width so cards spread evenly left to right */}
      <div className="w-full flex-1 flex flex-col min-h-0">
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
            <span className="font-bold text-xl sm:text-2xl">{loading ? '...' : cards.length}</span>
          </div>
        </div>


        {/* Grid: as many columns as fit (min 220px each), then wrap; evenly spaced */}
        <div
          className="mt-6 grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}
        >
          {cards.map((card, index) => (
            <CardWindow key={card.id || `${card.website}-${index}`} card={card} />
          ))}

          {!loading && cards.length === 0 && (
            <div className="p-8 text-xl font-semibold border-4 border-black bg-white" style={{ boxShadow }}>
              No active virtual cards found.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
