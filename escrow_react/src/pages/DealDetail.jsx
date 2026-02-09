import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Package, MessageCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

export default function DealDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  
  // Sample deal data (in real app, fetch from API)
  const deal = {
    id: 'ESC001',
    title: 'Website Development Project',
    description: 'Full-stack web application with React frontend and Node.js backend. Includes user authentication, dashboard, and payment integration.',
    amount: 50000,
    status: 'in-progress',
    category: 'Services',
    deadline: '2024-06-15',
    buyer: {
      id: 1,
      name: 'John Mutua',
      rating: 4.8,
      deals: 12
    },
    seller: {
      id: 2,
      name: 'Sarah Kimani',
      rating: 4.9,
      deals: 28
    },
    timeline: [
      { date: '2024-06-01', event: 'Deal Created', status: 'completed' },
      { date: '2024-06-02', event: 'Deal Accepted', status: 'completed' },
      { date: '2024-06-02', event: 'Payment Confirmed', status: 'completed' },
      { date: '2024-06-10', event: 'Work In Progress', status: 'active' },
    ]
  };
  
  const statusColors = {
    'pending-acceptance': 'amber',
    'pending-payment': 'orange',
    'in-progress': 'blue',
    'completed': 'green',
    'disputed': 'red',
    'cancelled': 'gray'
  };
  
  const color = statusColors[deal.status] || 'gray';
  
  const handleAcceptDeal = () => {
    toast.success('Deal accepted! Please proceed with payment.');
    // Simulate status change
    setTimeout(() => {
      navigate('/deals');
    }, 1500);
  };
  
  const handleRejectDeal = () => {
    if (confirm('Are you sure you want to reject this deal?')) {
      toast.success('Deal rejected');
      navigate('/deals');
    }
  };
  
  const handleCompleteDeal = () => {
    if (confirm('Mark this deal as completed? Funds will be released to the seller.')) {
      toast.success('Deal marked as completed! Funds released.');
      setTimeout(() => {
        navigate('/deals');
      }, 1500);
    }
  };
  
  const handleRaiseDispute = () => {
    setShowDisputeModal(true);
  };
  
  const submitDispute = (e) => {
    e.preventDefault();
    toast.success('Dispute raised successfully');
    setShowDisputeModal(false);
    setTimeout(() => {
      navigate('/deals');
    }, 1500);
  };
  
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl animate-slide-up">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Make Payment</h3>
            <button onClick={() => setShowPaymentModal(false)} className="p-2">
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-teal-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-teal-600">KES {deal.amount.toLocaleString()}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>M-Pesa</option>
              <option>Airtel Money</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="0712345678"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <button
            onClick={() => {
              toast.loading('Sending payment request...', { duration: 2000 });
              setTimeout(() => {
                toast.success('Payment successful!');
                setShowPaymentModal(false);
                navigate('/deals');
              }, 2500);
            }}
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
  
  const DisputeModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl animate-slide-up">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Raise Dispute</h3>
            <button onClick={() => setShowDisputeModal(false)} className="p-2">
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        
        <form onSubmit={submitDispute} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Dispute</label>
            <select
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select reason...</option>
              <option>Seller not responding</option>
              <option>Incomplete work</option>
              <option>Quality issues</option>
              <option>Delivery delay</option>
              <option>Not as described</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows="4"
              placeholder="Explain the issue in detail..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700"
          >
            Submit Dispute
          </button>
        </form>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/deals')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Deal Details</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Status Badge */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Deal ID: {deal.id}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}>
              {deal.status.replace(/-/g, ' ')}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h2>
          <p className="text-gray-600 leading-relaxed">{deal.description}</p>
        </div>
        
        {/* Amount Card */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-400 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Deal Amount</p>
          <p className="text-4xl font-bold">KES {deal.amount.toLocaleString()}</p>
        </div>
        
        {/* Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{deal.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="font-medium text-gray-900">{new Date(deal.deadline).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Parties */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Deal Parties</h3>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {deal.buyer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-900">{deal.buyer.name}</p>
                <p className="text-sm text-gray-500">Buyer • ⭐ {deal.buyer.rating}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-blue-100 rounded-full">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                {deal.seller.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-900">{deal.seller.name}</p>
                <p className="text-sm text-gray-500">Seller • ⭐ {deal.seller.rating}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-teal-100 rounded-full">
              <MessageCircle className="w-5 h-5 text-teal-600" />
            </button>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Deal Timeline</h3>
          <div className="space-y-4">
            {deal.timeline.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  {index < deal.timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-gray-900">{item.event}</p>
                  <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          {deal.status === 'pending-acceptance' && (
            <>
              <button
                onClick={handleAcceptDeal}
                className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700"
              >
                Accept Deal
              </button>
              <button
                onClick={handleRejectDeal}
                className="w-full bg-red-100 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-200"
              >
                Reject Deal
              </button>
            </>
          )}
          
          {deal.status === 'pending-payment' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700"
            >
              Make Payment
            </button>
          )}
          
          {deal.status === 'in-progress' && (
            <>
              <button
                onClick={handleCompleteDeal}
                className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700"
              >
                Mark as Completed
              </button>
              <button
                onClick={handleRaiseDispute}
                className="w-full bg-red-100 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-200 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                Raise Dispute
              </button>
            </>
          )}
        </div>
      </div>
      
      {showPaymentModal && <PaymentModal />}
      {showDisputeModal && <DisputeModal />}
    </div>
  );
}
