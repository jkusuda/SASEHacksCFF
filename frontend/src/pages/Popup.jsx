import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const ScoreDial = ({ score, label, justification }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

  // High score means consumer friendly, lower means danger
  const colorClass = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-brand-magenta';

  return (
    <div className="flex flex-col items-start bg-white p-2 border-2 border-black">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex justify-center items-center shrink-0 w-12 h-12">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
            <circle cx="22" cy="22" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`} />
          </svg>
          <span className="absolute text-xs font-bold">{score || 0}</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-xs uppercase tracking-wider truncate">{label}</span>
          <span className="text-[10px] text-gray-700 leading-tight mt-1">{justification || 'No justification provided.'}</span>
        </div>
      </div>
    </div>
  );
};

export default function Popup() {
  const [tab, setTab] = useState('scan');

  const [scanText, setScanText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  const [cards, setCards] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState('');

  const { getToken, user } = useAuth();

  useEffect(() => {
    if (tab === 'cards' && user) {
      fetchCards();
    }
  }, [tab, user])

  const fetchCards = async () => {
    setIsLoadingCards(true);
    setCardsError('');
    try {
      const token = await getToken();
      if (!token) throw new Error("Please log in via the main website first.");

      const res = await fetch(`${apiUrl}/cards/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch virtual cards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      setCardsError(err.message);
    } finally {
      setIsLoadingCards(false);
    }
  }

  const handleScan = async () => {
    if (!scanText.trim()) return;
    setIsScanning(true);
    setScanError('');
    setScanResults(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please log in via the main website first.");

      const res = await fetch(`${apiUrl}/ai/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tos_text: scanText })
      });
      if (!res.ok) throw new Error("Analysis failed. Backend might be down.");
      const data = await res.json();
      setScanResults(data.report);
    } catch (err) {
      setScanError(err.message);
    } finally {
      setIsScanning(false);
    }
  }

  const generateCard = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Please log in to generate cards.");

      const res = await fetch(`${apiUrl}/cards/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to generate card");
      fetchCards(); // Refresh the list
    } catch (err) {
      setCardsError(err.message);
    }
  }

  let dangerScore = '--';
  let tldrContent = null;

  if (scanResults) {
    const dp = scanResults.data_privacy?.score || 0;
    const intg = scanResults.integrity?.score || 0;
    const cf = scanResults.consumer_fairness?.score || 0;
    const avgScore = Math.round((dp + intg + cf) / 3);
    dangerScore = `${100 - avgScore}/100`;
    tldrContent = (
      <div className="flex flex-col gap-2 mt-3">
        <ScoreDial score={dp} label="Data Privacy" justification={scanResults.data_privacy?.justification} />
        <ScoreDial score={intg} label="Integrity" justification={scanResults.integrity?.justification} />
        <ScoreDial score={cf} label="Fairness" justification={scanResults.consumer_fairness?.justification} />
      </div>
    );
  } else if (scanError) {
    tldrContent = <span className="text-red-600 font-medium block mt-2 text-center text-xs">{scanError}</span>;
  } else if (isScanning) {
    tldrContent = <span className="font-medium animate-pulse block mt-4 text-center text-brand-magenta">Scanning with AI... This might take a few seconds.</span>;
  }

  return (
    <div className="flex flex-col h-[500px] w-[350px] min-w-[350px] min-h-[500px] bg-white text-black font-sans overflow-hidden border-4 border-black">
      <header className="p-4 bg-white border-b-4 border-black text-center flex justify-between items-center shrink-0">
        <h1 className="m-0 text-lg font-bold text-black uppercase tracking-wider">Subscriptos</h1>
        {user ? (
          <span className="text-xs font-mono bg-brand-cyan px-2 py-1 border-2 border-black rounded-none font-bold">Logged In</span>
        ) : (
          <span className="text-xs font-mono bg-red-500 text-white px-2 py-1 border-2 border-black rounded-none font-bold">Logged Out</span>
        )}
      </header>

      <nav className="flex border-b-4 border-black bg-gray-100 shrink-0">
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

      <main className="p-5 flex-1 overflow-y-auto bg-white flex flex-col">
        {tab === 'scan' && (
          <div className="flex flex-col flex-1">
            <p className="text-sm mb-4 font-medium shrink-0">Paste a Terms of Service below or let our auto-scanner detect subscription traps!</p>
            <textarea
              className="w-full p-3 mb-5 bg-white border-4 border-black rounded-none shadow-[4px_4px_0_0_#000] text-black text-sm focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0_0_#000] transition-all resize-none shrink-0"
              placeholder="Paste contract text here..."
              rows={4}
              value={scanText}
              onChange={(e) => setScanText(e.target.value)}
              disabled={isScanning}
            />
            <button
              onClick={handleScan}
              disabled={isScanning || !scanText.trim()}
              className="w-full shrink-0 p-3 bg-brand-magenta text-white font-bold rounded-none border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 cursor-pointer mb-5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? 'Analyzing...' : 'Analyze Contract'}
            </button>

            {(scanResults || isScanning || scanError) && (
              <div className="bg-[#f4f4f5] p-3 rounded-none border-4 border-black shadow-[4px_4px_0_0_#000] text-sm mt-auto mb-2 shrink-0">
                <div className="flex justify-between items-center mb-1 border-b-2 border-black pb-2">
                  <span className="uppercase font-bold text-xs tracking-wider text-gray-500">Scan Results</span>
                  {scanResults && (
                    <span className="font-bold text-xs">Danger: <span className="text-brand-magenta">{dangerScore}</span></span>
                  )}
                </div>
                {tldrContent}
              </div>
            )}
          </div>
        )}

        {tab === 'cards' && (
          <div className="flex flex-col h-full flex-1">
            <p className="text-sm mb-4 font-medium">Your protected active trials (via Stripe API):</p>

            {cardsError && (
              <p className="text-red-600 text-sm mb-2">{cardsError}</p>
            )}

            {!user ? (
              <div className="text-center p-8 text-black font-semibold bg-[#f4f4f5] border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none mb-6 text-sm">
                <span className="text-brand-magenta font-medium">Please log in to manage virtual cards.</span>
              </div>
            ) : isLoadingCards ? (
              <div className="text-center p-8 text-black font-semibold bg-[#f4f4f5] border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none mb-6 text-sm">
                Loading cards...
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center p-8 text-black font-semibold bg-[#f4f4f5] border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none mb-6 text-sm">
                No active virtual cards.
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-6 overflow-y-auto">
                {cards.map((card, i) => (
                  <div key={i} className="p-3 bg-brand-cyan/20 border-2 border-black rounded-none">
                    <p className="font-bold text-sm">Virtual Card</p>
                    <p className="font-mono text-xs">**** **** **** {card.last4 || '0000'}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={generateCard}
              disabled={isLoadingCards || !user}
              className="w-full p-3 mt-auto bg-brand-cyan text-black font-bold rounded-none border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Virtual Card
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
