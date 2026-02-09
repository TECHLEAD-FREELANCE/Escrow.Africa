import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import useAuthStore from '../stores/authStore';

export default function Chat() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  
  const conversations = [
    {
      id: 1,
      userId: 2,
      name: 'Sarah Kimani',
      lastMessage: 'The website looks great! Ready to deploy.',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      dealId: 'ESC001'
    },
    {
      id: 2,
      userId: 3,
      name: 'Michael Omondi',
      lastMessage: 'When can you deliver the laptop?',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      dealId: 'ESC002'
    },
    {
      id: 3,
      userId: 4,
      name: 'Grace Wanjiku',
      lastMessage: 'Thanks for the quick delivery!',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      dealId: 'ESC003'
    },
  ];
  
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </header>
      
      {/* Conversations List */}
      <div className="divide-y divide-gray-200">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.userId}`)}
              className="w-full p-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <div className="flex-shrink-0 ml-2 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{conv.unread}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-teal-600 mt-1">Deal: {conv.dealId}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
