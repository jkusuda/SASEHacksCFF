import { useState } from 'react';

const boxShadow = '6px 6px 0 0 #000';
const hoverBoxShadow = '4px 4px 0 0 #000';

export default function VirtualCardForm({ getToken, apiUrl, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subscription: '',
    monthlyLimit: '',
    line1: '',
    city: '',
    state: '',
    postal_code: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) throw new Error("Please log in to generate cards.");

      // Convert dollars to cents for Stripe
      const amountInCents = formData.monthlyLimit ? Math.round(parseFloat(formData.monthlyLimit) * 100) : null;

      const payload = {
        cardholder: {
          name: formData.name,
          email: formData.email,
          billing: {
            address: {
              line1: formData.line1,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postal_code,
              country: "US"
            }
          }
        },
        monthly_limit: amountInCents,
        subscription: formData.subscription
      };

      const res = await fetch(`${apiUrl}/cards/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to generate card");
      }

      const newCard = await res.json();
      onSuccess(newCard);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-2 bg-white border-2 border-black text-black text-xs font-mono focus:outline-none focus:border-brand-magenta transition-colors rounded-none mb-3";
  const labelClass = "block text-[10px] font-bold uppercase tracking-wider mb-1 mt-2 text-black";

  return (
    <div className="flex flex-col w-full h-full flex-1 min-h-0 bg-white m-0">
      <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-black shrink-0 px-4 pt-4">
        <h3 className="font-bold text-sm uppercase tracking-wider m-0">Create Virtual Card</h3>
      </div>
      
      {error && (
        <div className="mx-4 mb-2 p-2 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold shrink-0">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 p-4 pt-0 overflow-y-auto hidden-scrollbar">
        <div className="grid grid-cols-2 gap-x-3">
          <div>
            <label className={labelClass}>Cardholder Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Subscription / Merchant Name</label>
          <input required type="text" name="subscription" value={formData.subscription} onChange={handleChange} className={inputClass} placeholder="e.g. Netflix, Spotify" />
        </div>

        <div>
          <label className={labelClass}>Monthly Spend Limit (USD)</label>
          <input type="number" step="1" min="1" name="monthlyLimit" value={formData.monthlyLimit} onChange={handleChange} className={inputClass} placeholder="e.g. 15 (Optional but recommended)" />
        </div>

        <div className="border-t-2 border-gray-200 mt-2 pt-1 mb-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Billing Address</span>
        </div>

        <div>
           <label className={labelClass}>Address Line 1</label>
           <input required type="text" name="line1" value={formData.line1} onChange={handleChange} className={inputClass} placeholder="123 Main St" />
        </div>
        
        <div className="grid grid-cols-3 gap-x-2">
          <div className="col-span-1">
            <label className={labelClass}>City</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Dallas" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>State</label>
            <input required type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="TX" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>ZIP</label>
            <input required type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className={inputClass} placeholder="75001" />
          </div>
        </div>

        <div className="flex gap-3 mt-4 shrink-0 pb-4">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 p-2 bg-gray-200 text-black font-bold uppercase text-xs border-2 border-black hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 p-2 bg-brand-cyan text-black font-bold uppercase text-xs border-h border-black transition-all ${isSubmitting ? 'opacity-50' : 'hover:translate-x-0.5 hover:translate-y-0.5'}`}
            style={{ 
               borderWidth: '2px', 
               borderStyle: 'solid', 
               borderColor: '#000',
               boxShadow: isSubmitting ? hoverBoxShadow : boxShadow,
               transform: isSubmitting ? 'translate(2px, 2px)' : 'none'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Card'}
          </button>
        </div>
      </form>

      <style>{`
        .hidden-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .hidden-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .hidden-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
