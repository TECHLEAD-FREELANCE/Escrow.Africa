import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Link2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

export default function CreateDeal() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    timeline: '3',
    category: 'Services',
    role: 'buyer',
  });
  const [showShareLink, setShowShareLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  
  const categories = ['Services', 'Electronics', 'Vehicles', 'Real Estate', 'Digital Products', 'Other'];
  const timelines = ['1', '3', '7', '14', '30'];
  
  const platformFee = formData.amount ? (parseFloat(formData.amount) * 0.02) : 0;
  const totalAmount = formData.amount ? (parseFloat(formData.amount) + platformFee) : 0;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Simulate creating deal
    const dealId = 'ESC' + Date.now().toString().slice(-6);
    toast.success('Deal created successfully!');
    
    // Generate share link
    const dealData = {
      id: dealId,
      ...formData,
      creator: user.fullName,
      createdAt: new Date().toISOString(),
    };
    const encoded = btoa(JSON.stringify(dealData));
    const link = `${window.location.origin}/deals/invite/${encoded}`;
    setGeneratedLink(link);
    setShowShareLink(true);
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link copied to clipboard!');
  };
  
  const shareWhatsApp = () => {
    const text = `Check out this escrow deal: ${formData.title}\\n${generatedLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  
  if (showShareLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-4 flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Share Deal</h1>
          </div>
        </header>
        
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal Created!</h2>
            <p className="text-gray-600 mb-4">Share this link with the other party</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
            <div className="bg-gray-50 rounded-xl p-4 mb-3 break-all text-sm text-gray-700">
              {generatedLink}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700"
              >
                <Link2 className="w-5 h-5" />
                Copy Link
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700"
              >
                <Share2 className="w-5 h-5" />
                WhatsApp
              </button>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/deals')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300"
          >
            View My Deals
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Create Deal</h1>
        </div>
      </header>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Website Development"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what needs to be done..."
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="50000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline (days)</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {timelines.map(days => (
                  <option key={days} value={days}>{days} days</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                className={`py-3 rounded-xl font-medium transition-all ${
                  formData.role === 'buyer'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'seller' }))}
                className={`py-3 rounded-xl font-medium transition-all ${
                  formData.role === 'seller'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Seller
              </button>
            </div>
          </div>
        </div>
        
        {/* Fee Calculation */}
        {formData.amount && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Deal Amount</span>
              <span className="font-semibold">KES {parseFloat(formData.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Platform Fee (2%)</span>
              <span className="font-semibold">KES {platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-teal-600 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>KES {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700 shadow-lg"
        >
          Create Deal
        </button>
      </form>
    </div>
  );
}
