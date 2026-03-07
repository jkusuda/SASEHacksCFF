import { useState } from 'react'

export default function Popup() {
  const [tab, setTab] = useState('scan');

  // Note: we're using the exact same Tailwind tailwindcss classNames
  // that the main landing page has access to!

  return (
    <div className="flex flex-col h-[500px] w-[350px] min-w-[350px] min-h-[500px] bg-white text-black font-sans overflow-hidden border-2 border-black">
      <header className="p-4 bg-white border-b-2 border-black text-center">
        <h1 className="m-0 text-lg font-bold text-black uppercase tracking-wider">SASEHacks CFF</h1>
      </header>

      <nav className="flex border-b-2 border-black bg-gray-100">
        <button
          className={`flex-1 p-3 font-bold cursor-pointer border-r-2 border-black transition-colors ${tab === 'scan' ? 'bg-brand-magenta text-white' : 'text-black hover:bg-gray-200'}`}
          onClick={() => setTab('scan')}
        >
          Scan ToS
        </button>
        <button
          className={`flex-1 p-3 font-bold cursor-pointer transition-colors ${tab === 'cards' ? 'bg-brand-cyan text-black' : 'text-black hover:bg-gray-200'}`}
          onClick={() => setTab('cards')}
        >
          Virtual Cards
        </button>
      </nav>

      <main className="p-5 flex-1 overflow-y-auto bg-white">
        {tab === 'scan' && (
          <div className="flex flex-col h-full">
            <p className="text-sm mb-4 font-medium">Paste a Terms of Service below or let our auto-scanner detect subscription traps!</p>
            <textarea
              className="w-full p-3 mb-5 bg-white border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] text-black text-sm focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0_0_#000] transition-all resize-none"
              placeholder="Paste contract text here..."
              rows={4}
            />
            <button className="w-full p-3 bg-brand-magenta text-white font-bold rounded-none border-2 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 cursor-pointer mb-5 text-lg">
              Analyze Contract
            </button>
            <div className="bg-[#f4f4f5] p-4 rounded-none border-2 border-black shadow-[4px_4px_0_0_#000] text-sm mt-auto">
              <p className="mb-2 uppercase font-bold text-xs tracking-wider text-gray-500">Scan Results</p>
              <p className="mb-2">Danger Score: <strong className="text-brand-magenta">--/100</strong></p>
              <p>TLDR: <em>Waiting for scan...</em></p>
            </div>
          </div>
        )}

        {tab === 'cards' && (
          <div className="flex flex-col h-full">
            <p className="text-sm mb-4 font-medium">Your protected active trials:</p>
            <div className="text-center p-8 text-black font-semibold bg-[#f4f4f5] border-2 border-black shadow-[4px_4px_0_0_#000] rounded-none mb-6 text-sm">
              No active virtual cards.
            </div>
            <button className="w-full p-3 mt-auto bg-brand-cyan text-black font-bold rounded-none border-2 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 cursor-pointer text-lg">
              Generate Virtual Card
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
