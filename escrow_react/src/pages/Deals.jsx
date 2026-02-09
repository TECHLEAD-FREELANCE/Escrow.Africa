import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';

export default function Deals() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // active, completed, all
  
  // Simulated deals data
  const deals = [
    {
      id: 'ESC001',
      title: 'Website Development Project',
      amount: 50000,
      status: 'in-progress',
      buyer: 'John Mutua',
      seller: 'Sarah Kimani',
      deadline: '2026-02-15',
      category: 'Services',
    },
    {
      id: 'ESC002',
      title: 'Laptop Sale - Dell XPS 15',
      amount: 85000,
      status: 'pending-payment',
      buyer: 'John Mutua',
      seller: 'Mike Ochieng',
      deadline: '2026-02-12',
      category: 'Electronics',
    },
    {
      id: 'ESC003',
      title: 'Logo Design Package',
      amount: 15000,
      status: 'completed',
      buyer: 'Sarah Kimani',
      seller: 'John Mutua',
      deadline: '2026-02-01',
      category: 'Services',
    },
  ];
  
  const filteredDeals = deals.filter(deal => {
    if (activeTab === 'active') return deal.status !== 'completed';
    if (activeTab === 'completed') return deal.status === 'completed';
    return true;
  });
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending-payment': return 'bg-amber-100 text-amber-700';
      case 'pending-acceptance': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'disputed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusText = (status) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">My Deals</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            All
          </button>
        </div>
      </header>
      
      {/* Deals List */}
      <div className="p-4 space-y-3">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-6">Create your first escrow deal to get started</p>
            <button
              onClick={() => navigate('/deals/create')}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700"
            >
              Create Deal
            </button>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => navigate(`/deals/${deal.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{deal.title}</h3>
                  <p className="text-sm text-gray-600">Deal ID: {deal.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                  {getStatusText(deal.status)}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="text-2xl font-bold text-teal-600">
                  KES {deal.amount.toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(deal.deadline).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">{deal.category}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <span>Buyer: <span className="font-medium">{deal.buyer}</span></span>
                <span>Seller: <span className="font-medium">{deal.seller}</span></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
