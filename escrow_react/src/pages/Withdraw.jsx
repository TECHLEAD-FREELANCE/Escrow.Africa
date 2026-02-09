import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

export default function Withdraw() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  
  const quickAmounts = [500, 1000, 2000, 5000, 10000];
  const withdrawalFee = amount ? Math.max(50, parseFloat(amount) * 0.01) : 0;
  const totalDeduction = amount ? parseFloat(amount) + withdrawalFee : 0;
  
  const handleQuickAmount = (value) => {
    if (value <= (user?.walletBalance || 0)) {
      setAmount(value.toString());
    } else {
      toast.error('Insufficient balance');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum withdrawal amount is KES 100');
      return;
    }
    
    if (totalDeduction > (user?.walletBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    
    if (!phoneNumber) {
      toast.error('Please enter phone number');
      return;
    }
    
    setLoading(true);
    toast.loading('Processing withdrawal...', { id: 'withdraw' });
    
    // Simulate withdrawal processing
    setTimeout(() => {
      const newBalance = (user.walletBalance || 0) - totalDeduction;
      updateUser({ walletBalance: newBalance });
      
      toast.success(`Withdrawal successful! Amount sent to ${phoneNumber}`, { id: 'withdraw' });
      setLoading(false);
      
      setTimeout(() => {
        navigate('/wallet');
      }, 1500);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/wallet')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Withdraw Funds</h1>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-6 text-white text-center">
          <p className="text-sm opacity-90 mb-2">Available Balance</p>
          <p className="text-4xl font-bold">KES {user?.walletBalance?.toLocaleString() || '0'}</p>
        </div>
        
        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Withdrawal Fee</p>
            <p>A fee of 1% (min KES 50) applies to all withdrawals</p>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Withdrawal Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('mpesa')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'mpesa'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Smartphone className={`w-8 h-8 mx-auto mb-2 ${
                method === 'mpesa' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <p className={`font-medium ${
                method === 'mpesa' ? 'text-orange-500' : 'text-gray-700'
              }`}>M-Pesa</p>
            </button>
            
            <button
              type="button"
              onClick={() => setMethod('airtel')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'airtel'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Smartphone className={`w-8 h-8 mx-auto mb-2 ${
                method === 'airtel' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <p className={`font-medium ${
                method === 'airtel' ? 'text-orange-500' : 'text-gray-700'
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
              className="w-full pl-20 pr-4 py-4 text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            {quickAmounts.map(value => (
              <button
                key={value}
                type="button"
                onClick={() => handleQuickAmount(value)}
                className="py-2 px-3 bg-orange-50 text-orange-600 rounded-lg font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                disabled={value > (user?.walletBalance || 0)}
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Fee Breakdown */}
        {amount && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Withdrawal Amount</span>
              <span className="font-semibold">KES {parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Processing Fee (1%)</span>
              <span className="font-semibold">KES {withdrawalFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t border-gray-100">
              <span>Total Deduction</span>
              <span>KES {totalDeduction.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        {/* Phone Number */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0712345678"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Processing...' : 'Withdraw Funds'}
        </button>
        
        <p className="text-center text-sm text-gray-500">
          Funds will be sent to your mobile money account instantly
        </p>
      </form>
    </div>
  );
}
