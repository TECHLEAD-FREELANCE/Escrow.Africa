import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  const transactions = [
    { id: 1, type: 'deal', subType: 'payment', title: 'Website Development', dealId: 'ESC001', amount: -50000, date: '2024-06-10', status: 'completed' },
    { id: 2, type: 'wallet', subType: 'topup', title: 'Wallet Top-up', amount: 100000, date: '2024-06-09', status: 'completed' },
    { id: 3, type: 'deal', subType: 'received', title: 'Logo Design', dealId: 'ESC003', amount: 15000, date: '2024-06-08', status: 'completed' },
    { id: 4, type: 'wallet', subType: 'withdrawal', title: 'Withdrawal to M-Pesa', amount: -25000, date: '2024-06-07', status: 'completed' },
    { id: 5, type: 'deal', subType: 'payment', title: 'Laptop Purchase', dealId: 'ESC002', amount: -85000, date: '2024-06-05', status: 'completed' },
    { id: 6, type: 'deal', subType: 'received', title: 'App Development', dealId: 'ESC006', amount: 120000, date: '2024-06-03', status: 'completed' },
    { id: 7, type: 'wallet', subType: 'topup', title: 'Wallet Top-up', amount: 50000, date: '2024-06-01', status: 'completed' },
  ];
  
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'deals') return tx.type === 'deal';
    if (activeTab === 'wallet') return tx.type === 'wallet';
    return true;
  });
  
  const stats = {
    totalDeals: transactions.filter(t => t.type === 'deal').length,
    totalReceived: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    totalSent: Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Transaction History</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'deals'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Deals
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'wallet'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Wallet
            </button>
          </div>
        </div>
      </header>
      
      {/* Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Calendar className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
            <p className="text-xs text-gray-500 mt-1">Deals</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{(stats.totalReceived / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-1">Received</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{(stats.totalSent / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-1">Sent</p>
          </div>
        </div>
        
        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.amount > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{tx.title}</p>
                    {tx.dealId && (
                      <p className="text-sm text-teal-600">{tx.dealId}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}KES {Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {tx.status}
                  </span>
                </div>
              </div>
              
              {tx.type === 'deal' && (
                <button
                  onClick={() => navigate(`/deals/${tx.dealId}`)}
                  className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  View Deal →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
