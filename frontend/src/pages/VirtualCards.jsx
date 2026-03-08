import { useEffect, useState } from 'react'
import { Heading, CardWindow } from '../components'
import { useAuth } from '../contexts/AuthContext'


const boxShadow = '4px 4px 0 0 #000'


export default function VirtualCards() {
  const { user, getToken } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchCards() {
      if (!user) return

      try {
        const token = await getToken()
        if (!token) return

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await fetch(`${apiUrl}/cards/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  const handleCancelCard = async (cardId) => {
    try {
      const token = await getToken()
      if (!token) return

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setCards(prevCards => prevCards.filter(c => c.id !== cardId))
      } else {
        const errorData = await res.json()
        console.error("Failed to cancel card:", errorData)
      }
    } catch (err) {
      console.error("Error canceling card:", err)
    }
  }

  return (
    <>
      <Heading className="text-black mb-[clamp(1.5rem,4vw+2rem,4rem)] shrink-0 !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl">
        Virtual Cards Control Center
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
          {loading &&
            [1].map((i) => (
              <div
                key={`skeleton-${i}`}
                className="w-full min-w-0 min-h-[400px] border-4 border-black bg-white flex flex-col overflow-hidden"
                style={{ boxShadow }}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 border-b-4 border-black bg-gray-100 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-gray-300 border-2 border-black animate-pulse" />
                  <span className="w-3 h-3 rounded-full bg-gray-300 border-2 border-black animate-pulse" />
                  <span className="w-3 h-3 rounded-full bg-gray-300 border-2 border-black animate-pulse" />
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2.5">
                  <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-auto pt-4 space-y-2">
                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-3/5 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          {!loading && cards.map((card, index) => (
            <CardWindow key={card.id || `${card.website}-${index}`} card={card} onCancel={handleCancelCard} />
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
