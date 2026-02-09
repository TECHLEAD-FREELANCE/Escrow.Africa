import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import useAuthStore from '../stores/authStore';

export default function Wallet() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const transactions = [
    { id: 1, type: 'credit', description: 'Payment received - ESC001', amount: 50000, date: '2024-06-10', status: 'completed' },
    { id: 2, type: 'debit', description: 'Deal payment - ESC002', amount: 85000, date: '2024-06-08', status: 'completed' },
    { id: 3, type: 'credit', description: 'Wallet top-up', amount: 100000, date: '2024-06-05', status: 'completed' },
    { id: 4, type: 'debit', description: 'Withdrawal to M-Pesa', amount: 25000, date: '2024-06-02', status: 'pending' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-400 p-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white">
            <WalletIcon className="w-6 h-6" />
            <h1 className="text-xl font-semibold">My Wallet</h1>
          </div>
          <button className="text-white/90 hover:text-white text-sm">
            History
          </button>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-white/90 text-sm mb-2">Available Balance</p>
          <p className="text-5xl font-bold text-white">KES {user?.walletBalance?.toLocaleString() || '0'}</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 -mt-16 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/wallet/topup')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 text-center">Top Up</p>
          </button>
          
          <button
            onClick={() => navigate('/wallet/withdraw')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowUpRight className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900 text-center">Withdraw</p>
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">This Month</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Received</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">KES 150K</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Sent</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">KES 110K</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="px-4">
        <h2 className="font-semibold text-gray-900 mb-3">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}KES {tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
