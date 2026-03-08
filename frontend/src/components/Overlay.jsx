import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ScoreDial = ({ score, label, justification }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;
  
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
          <span className="absolute text-xs font-bold font-sans">{score || 0}</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0 font-sans">
          <span className="font-bold text-xs uppercase tracking-wider truncate text-black">{label}</span>
          <span className="text-[10px] text-gray-700 leading-tight mt-1">{justification || 'No justification provided.'}</span>
        </div>
      </div>
    </div>
  );
};

export default function Overlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState('prompt'); // 'prompt', 'scanning', 'results', 'card'
  
  const [scanResults, setScanResults] = useState(null);
  const [scanError, setScanError] = useState('');
  const [scanStatusMsg, setScanStatusMsg] = useState('Scanning fine print...');
  
  const [cardDetails, setCardDetails] = useState(null);
  const [cardError, setCardError] = useState('');
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  const { getToken, user } = useAuth();

  useEffect(() => {
    // Slide in effect on mount
    setTimeout(() => setIsVisible(true), 1000);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
  };

  const handleScan = async () => {
    setMode('scanning');
    setScanError('');
    setScanStatusMsg('Searching for legal links...');
    
    try {
      const token = await getToken();
      if (!token) throw new Error("Please log in to Subscriptos to scan.");
      
      // 1. Discover Links on Page
      const links = Array.from(document.querySelectorAll('a'));
      const keywords = ['terms', 'tos', 'privacy', 'condition', 'agreement', 'policy'];
      
      let relevantUrls = [];
      for (const link of links) {
        const text = link.innerText.toLowerCase();
        const href = link.href.toLowerCase();
        
        // Skip empty, anchors, or identical links
        if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href === window.location.href) continue;
        
        const isRelevant = keywords.some(kw => (text.includes(kw) && text.length < 50) || href.includes(`/${kw}`));
        
        if (isRelevant && !relevantUrls.includes(link.href)) {
          // Limit to max 2 unique links to avoid overloading
          if (relevantUrls.length < 2) {
             relevantUrls.push(link.href);
          }
        }
      }

      let combinedText = '';

      if (relevantUrls.length > 0) {
        console.log(`Subscriptos Crawler: Found legal links!`, relevantUrls);
        setScanStatusMsg(`Found ${relevantUrls.length} legal document(s)...`);
        
        // 2. Fetch HTML
        for (const url of relevantUrls) {
           try {
             const htmlRes = await fetch(url);
             if (htmlRes.ok) {
               const htmlStr = await htmlRes.text();
               // 3. Parse virtual DOM
               const parser = new DOMParser();
               const doc = parser.parseFromString(htmlStr, 'text/html');
               
               // Try to target main content areas to avoid header/footer noise
               const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body;
               combinedText += `\n--- Document from ${url} ---\n` + (mainContent?.innerText || '');
             }
           } catch(e) {
             console.log(`Subscriptos Crawler: Failed to fetch ${url}`, e);
           }
        }
      }

      // 4. Fallback if fetching failed or no links found
      if (!combinedText.trim()) {
        console.log(`Subscriptos Crawler: No external links found or fetched, falling back to page text.`);
        setScanStatusMsg("Reading fine print on this page...");
        combinedText = document.body.innerText;
      }

      setScanStatusMsg("Analyzing documents with AI...");
      console.log("Subscriptos Crawler: Final payload length:", combinedText.length);

      const res = await fetch(`${apiUrl}/ai/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tos_text: combinedText.substring(0, 10000) }) // Give it up to 10k chars of combined text
      });
      
      if (!res.ok) throw new Error("Analysis failed. Backend might be down.");
      const data = await res.json();
      setScanResults(data.report);
      setMode('results');
    } catch (err) {
      setScanError(err.message);
      setMode('results');
    }
  };


  const generateCard = async () => {
    setMode('card');
    setIsLoadingCard(true);
    setCardError('');
    try {
      const token = await getToken();
      if (!token) throw new Error("Please log in to Subscriptos to generate cards.");
      
      const res = await fetch(`${apiUrl}/cards/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to generate card");
      
      // Fetch latest list
      const listRes = await fetch(`${apiUrl}/cards/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const listData = await listRes.json();
      if (listData && listData.length > 0) {
        setCardDetails(listData[0]); // Show the newest
      }
    } catch (err) {
      setCardError(err.message);
    } finally {
      setIsLoadingCard(false);
    }
  };

  let safetyScore = '--';
  let safetyColor = 'text-brand-magenta';
  if (scanResults) {
    const dp = scanResults.data_privacy?.score || 0;
    const intg = scanResults.integrity?.score || 0;
    const cf = scanResults.consumer_fairness?.score || 0;
    const avg = Math.round((dp + intg + cf) / 3);
    safetyScore = `${avg}/100`;
    safetyColor = avg >= 80 ? 'text-green-500' : avg >= 50 ? 'text-yellow-500' : 'text-brand-magenta';
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 2147483647, // max z-index
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className="flex flex-col w-[350px] min-w-[350px] bg-white text-black font-sans overflow-hidden border-4 border-black box-border"
    >
      <header className="p-4 bg-white border-b-4 border-black text-center flex justify-between items-center shrink-0 m-0">
        <h2 className="m-0 text-base font-bold text-black uppercase tracking-wider">Subscriptos</h2>
        <button onClick={dismiss} className="text-black hover:bg-gray-200 font-bold bg-white border-2 border-black cursor-pointer text-lg px-2 rounded-none transition-colors leading-none">&times;</button>
      </header>

      <div className="p-4 text-black bg-white m-0">
        {mode === 'prompt' && (
          <div className="flex flex-col flex-1">
            <p className="text-sm font-medium mb-4 mt-0 shrink-0">We detected a checkout or trial sign-up! What would you like to do?</p>
            {!user && (
              <p className="text-xs text-brand-magenta font-medium mb-4">Please log in on the main website to use features.</p>
            )}
            <button 
              onClick={handleScan}
              disabled={!user}
              className="w-full shrink-0 p-3 bg-brand-magenta text-white font-bold rounded-none border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 cursor-pointer mb-5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Scan Page For Traps
            </button>
            <button 
              onClick={generateCard}
              disabled={!user}
              className="w-full shrink-0 p-3 bg-brand-cyan text-black font-bold rounded-none border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 cursor-pointer mb-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Protect Wallet (Virtual Card)
            </button>
          </div>
        )}

        {mode === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-brand-magenta font-bold animate-pulse text-sm m-0">
              {scanStatusMsg}
            </div>
          </div>
        )}

        {mode === 'results' && scanResults && (
           <div className="flex flex-col m-0">
             <div className="bg-[#f4f4f5] p-3 rounded-none border-4 border-black shadow-[4px_4px_0_0_#000] text-sm mt-auto mb-4 shrink-0">
               <div className="flex justify-between items-center mb-1 border-b-2 border-black pb-2">
                 <span className="uppercase font-bold text-xs tracking-wider text-gray-500">Scan Results</span>
                 <span className="font-bold text-xs">Safety Score: <span className={safetyColor}>{safetyScore}</span></span>
               </div>
               <div className="flex flex-col gap-2 mt-3 max-h-[200px] overflow-y-auto pr-1">
                 <ScoreDial score={scanResults.data_privacy?.score} label="Privacy" justification={scanResults.data_privacy?.justification} />
                 <ScoreDial score={scanResults.integrity?.score} label="Integrity" justification={scanResults.integrity?.justification} />
                 <ScoreDial score={scanResults.consumer_fairness?.score} label="Fairness" justification={scanResults.consumer_fairness?.justification} />
               </div>
             </div>
             <button onClick={() => setMode('prompt')} className="w-full p-3 font-bold cursor-pointer transition-colors bg-gray-200 text-black border-4 border-black hover:bg-gray-300">Back</button>
           </div>
        )}

        {mode === 'results' && scanError && (
          <div className="flex flex-col m-0">
            <span className="text-red-600 font-medium block mt-2 mb-4 text-center text-xs">{scanError}</span>
            <button onClick={() => setMode('prompt')} className="w-full p-3 font-bold cursor-pointer transition-colors bg-gray-200 text-black border-4 border-black hover:bg-gray-300">Back</button>
          </div>
        )}

        {mode === 'card' && (
           <div className="flex flex-col m-0">
             <p className="text-sm mb-4 font-medium">Your protected active trials (via Stripe API):</p>
             {isLoadingCard ? (
               <div className="text-center p-8 text-black font-semibold bg-[#f4f4f5] border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none mb-6 text-sm">
                 Loading cards...
               </div>
             ) : cardError ? (
               <span className="text-red-600 font-medium block mt-2 mb-4 text-center text-xs">{cardError}</span>
             ) : cardDetails ? (
               <div className="flex flex-col gap-3 mb-6 overflow-y-auto">
                 <div className="p-3 bg-brand-cyan/20 border-2 border-black rounded-none">
                   <p className="font-bold text-sm">Virtual Card</p>
                   <p className="font-mono text-xs">**** **** **** {cardDetails.last4 || '0000'}</p>
                 </div>
               </div>
             ) : null}
             <button onClick={() => setMode('prompt')} className="w-full p-3 font-bold cursor-pointer transition-colors bg-gray-200 text-black border-4 border-black hover:bg-gray-300">Back</button>
           </div>
        )}
      </div>
    </div>
  );
}
