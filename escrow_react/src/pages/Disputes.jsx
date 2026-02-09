import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Disputes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('open');
  
  const disputes = [
    {
      id: 'DIS001',
      dealId: 'ESC004',
      dealTitle: 'Logo Design Services',
      reason: 'Quality issues',
      description: 'The delivered logo does not match the agreed specifications.',
      status: 'open',
      createdAt: '2024-06-10',
      amount: 15000,
      timeline: [
        { date: '2024-06-10', event: 'Dispute raised', status: 'completed' },
        { date: '2024-06-11', event: 'Under review', status: 'active' },
        { date: null, event: 'Resolution', status: 'pending' },
      ]
    },
    {
      id: 'DIS002',
      dealId: 'ESC005',
      dealTitle: 'Mobile App Development',
      reason: 'Delivery delay',
      description: 'Project deadline passed without delivery.',
      status: 'resolved',
      createdAt: '2024-06-05',
      resolvedAt: '2024-06-08',
      amount: 75000,
      resolution: 'Funds returned to buyer',
      timeline: [
        { date: '2024-06-05', event: 'Dispute raised', status: 'completed' },
        { date: '2024-06-06', event: 'Under review', status: 'completed' },
        { date: '2024-06-08', event: 'Resolved - Refund issued', status: 'completed' },
      ]
    },
  ];
  
  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'open') return d.status === 'open';
    if (activeTab === 'resolved') return d.status === 'resolved';
    return true;
  });
  
  const statusColors = {
    open: 'amber',
    resolved: 'green',
    rejected: 'red'
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
            <h1 className="text-xl font-semibold text-gray-900">Disputes</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('open')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'open'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'resolved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Resolved
            </button>
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
          </div>
        </div>
      </header>
      
      {/* Disputes List */}
      <div className="p-4 space-y-4">
        {filteredDisputes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No {activeTab !== 'all' ? activeTab : ''} disputes</p>
          </div>
        ) : (
          filteredDisputes.map(dispute => {
            const color = statusColors[dispute.status];
            
            return (
              <div key={dispute.id} className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">Dispute ID: {dispute.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}>
                        {dispute.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{dispute.dealTitle}</h3>
                    <p className="text-sm text-gray-600">Deal: {dispute.dealId}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-teal-600">KES {dispute.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Reason */}
                <div className="bg-red-50 rounded-xl p-3 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">{dispute.reason}</p>
                    <p className="text-sm text-red-700 mt-1">{dispute.description}</p>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Timeline</h4>
                  <div className="space-y-3">
                    {dispute.timeline.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'completed' ? 'bg-green-100' :
                            item.status === 'active' ? 'bg-amber-100' :
                            'bg-gray-100'
                          }`}>
                            {item.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : item.status === 'active' ? (
                              <Clock className="w-5 h-5 text-amber-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          {index < dispute.timeline.length - 1 && (
                            <div className="w-0.5 h-6 bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="font-medium text-gray-900">{item.event}</p>
                          {item.date && (
                            <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Resolution */}
                {dispute.resolution && (
                  <div className="bg-green-50 rounded-xl p-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Resolution</p>
                      <p className="text-sm text-green-700 mt-1">{dispute.resolution}</p>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                {dispute.status === 'open' && (
                  <button
                    onClick={() => navigate(`/deals/${dispute.dealId}`)}
                    className="w-full bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700"
                  >
                    View Deal Details
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
