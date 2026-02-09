import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

export default function TopUp() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];
  
  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum top-up amount is KES 100');
      return;
    }
    
    if (!phoneNumber) {
      toast.error('Please enter phone number');
      return;
    }
    
    setLoading(true);
    toast.loading('Sending payment request...', { id: 'topup' });
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success('Payment request sent! Check your phone.', { id: 'topup' });
      
      // Simulate payment confirmation
      setTimeout(() => {
        const newBalance = (user.walletBalance || 0) + parseFloat(amount);
        updateUser({ walletBalance: newBalance });
        
        toast.success(`Top-up successful! New balance: KES ${newBalance.toLocaleString()}`);
        setLoading(false);
        
        setTimeout(() => {
          navigate('/wallet');
        }, 1500);
      }, 3000);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/wallet')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Top Up Wallet</h1>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-400 rounded-2xl p-6 text-white text-center">
          <p className="text-sm opacity-90 mb-2">Current Balance</p>
          <p className="text-4xl font-bold">KES {user?.walletBalance?.toLocaleString() || '0'}</p>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('mpesa')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'mpesa'
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Smartphone className={`w-8 h-8 mx-auto mb-2 ${
                method === 'mpesa' ? 'text-teal-600' : 'text-gray-400'
              }`} />
              <p className={`font-medium ${
                method === 'mpesa' ? 'text-teal-600' : 'text-gray-700'
              }`}>M-Pesa</p>
            </button>
            
            <button
              type="button"
              onClick={() => setMethod('airtel')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'airtel'
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                method === 'airtel' ? 'text-teal-600' : 'text-gray-400'
              }`} />
              <p className={`font-medium ${
                method === 'airtel' ? 'text-teal-600' : 'text-gray-700'
              }`}>Airtel Money</p>
            </button>
          </div>
        </div>
        
        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">KES</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-20 pr-4 py-4 text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            {quickAmounts.map(value => (
              <button
                key={value}
                type="button"
                onClick={() => handleQuickAmount(value)}
                className="py-2 px-3 bg-teal-50 text-teal-600 rounded-lg font-medium hover:bg-teal-100 transition-colors"
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Phone Number */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0712345678"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
        
        <p className="text-center text-sm text-gray-500">
          Minimum top-up amount is KES 100
        </p>
      </form>
    </div>
  );
}
