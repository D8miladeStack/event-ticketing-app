import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleX,
  Clock3,
  ClipboardList,
  Ticket
} from 'lucide-react';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [userName, setUserName] = useState('');
  const [seats, setSeats] = useState(1);
  const [refCode, setRefCode] = useState('');
  const [message, setMessage] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/status', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Status request failed with HTTP ${res.status}`);
      }
      const data = await res.json();
      setStatus(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch event status:", err);
    }
  };

  useEffect(() => {
    const initialRefresh = window.setTimeout(fetchStatus, 0);
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchStatus();
      }
    }, 5000);
    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchStatus();
      }
    };
    document.addEventListener('visibilitychange', refreshOnVisibility);

    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', refreshOnVisibility);
    };
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, seats: Number(seats) })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Booked successfully! Reference Code: ${data.referenceCode}` });
        setUserName('');
        setSeats(1);
      } else {
        setMessage({ type: 'warning', text: data.message });
      }
      fetchStatus();
    } catch {
      setMessage({ type: 'error', text: 'Server error while booking.' });
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refCode })
      });
      const data = await res.json();
      if (data.success) {
        let msg = data.message;
        if (data.promotedUser) {
          msg += ` Promoted: ${data.promotedUser.booking.userName} (${data.promotedUser.referenceCode})`;
        }
        setMessage({ type: 'success', text: msg });
        setRefCode('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
      fetchStatus();
    } catch {
      setMessage({ type: 'error', text: 'Server error while canceling.' });
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-semibold bg-slate-900 text-white min-h-screen flex items-center justify-center">Loading Event Dashboard...</div>;

  const percentage = Math.round((status.takenSeats / status.totalCapacity) * 100);
  const AlertIcon = message?.type ? {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: CircleX
  }[message.type] : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-400">{status.eventName}</h1>
            <p className="text-slate-400 text-sm mt-1">Digital Skillup Africa 2.0 Full-Stack Capstone Project</p>
          </div>
          <div className="flex gap-4 bg-slate-900 px-5 py-3 rounded-xl border border-slate-700">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Capacity</p>
              <p className="text-xl font-bold text-center">{status.totalCapacity}</p>
            </div>
            <div className="border-r border-slate-700"></div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Available</p>
              <p className="text-xl font-bold text-center text-emerald-400">{status.availableSeats}</p>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span>Seat Occupancy</span>
            <span>{status.takenSeats} / {status.totalCapacity} Seats Taken ({percentage}%)</span>
          </div>
          <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
          </div>
        </div>

        {/* Alert Box */}
        {message && AlertIcon && (
          <div className={`p-4 rounded-xl border font-medium text-sm ${
            message.type === 'success' ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300' :
            message.type === 'warning' ? 'bg-amber-950/50 border-amber-500 text-amber-300' :
            'bg-rose-950/50 border-rose-500 text-rose-300'
          }`}>
            <div className="flex items-start gap-3">
              <AlertIcon className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={2.2} />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Action Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Book Ticket Form */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2"><Ticket className="w-5 h-5" /> Book Tickets</h2>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Attendee Name</label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    required 
                    placeholder="e.g. Oluwademilade" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Number of Seats</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={seats} 
                    onChange={(e) => setSeats(e.target.value)} 
                    required 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>

          {/* Cancel Ticket Form */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-rose-300 mb-4 flex items-center gap-2"><CircleX className="w-5 h-5" /> Cancel Booking</h2>
              <form onSubmit={handleCancel} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Reference Code</label>
                  <input 
                    type="text" 
                    value={refCode} 
                    onChange={(e) => setRefCode(e.target.value)} 
                    required 
                    placeholder="e.g. REF-7J3XI0" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 uppercase"
                  />
                </div>
                <p className="text-xs text-slate-400">Canceling a ticket automatically promotes the next person in the waitlist queue!</p>
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg mt-4">
                  Cancel & Promote
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Lists Grid (Active Bookings & Waitlist) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Bookings */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Confirmed Bookings ({status.bookings.length})</h2>
            {status.bookings.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No bookings yet.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {status.bookings.map(([code, booking]) => (
                  <div key={code} className="bg-slate-900 border border-slate-700/60 p-3 rounded-xl flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-slate-200">{booking.userName}</p>
                      <p className="text-xs text-indigo-400 font-mono">{code}</p>
                    </div>
                    <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs font-medium">
                      {booking.seats} seat(s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waitlist Queue */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2"><Clock3 className="w-5 h-5" /> Waitlist Queue ({status.waitlist.length})</h2>
            {status.waitlist.length === 0 ? (
              <p className="text-slate-500 text-sm italic">Waitlist is currently empty.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {status.waitlist.map((item, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-700/60 p-3 rounded-xl flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 w-4">#{index + 1}</span>
                      <p className="font-semibold text-slate-200">{item.userName}</p>
                    </div>
                    <span className="bg-amber-950/40 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-lg text-xs font-medium">
                      Requested {item.requestedSeats} seat(s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;