import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, User, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const sampleUsers = [
    { id: 1, name: 'John Mutua', username: 'buyer1', rating: 4.8, deals: 12, verified: true },
    { id: 2, name: 'Sarah Kimani', username: 'seller1', rating: 4.9, deals: 28, verified: true },
    { id: 3, name: 'Michael Omondi', username: 'mike_o', rating: 4.5, deals: 8, verified: false },
    { id: 4, name: 'Grace Wanjiku', username: 'grace_w', rating: 5.0, deals: 15, verified: true },
    { id: 5, name: 'David Kamau', username: 'david_k', rating: 4.7, deals: 22, verified: true },
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a username');
      return;
    }
    
    setSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = sampleUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setSearching(false);
      
      if (results.length === 0) {
        toast.error('No users found');
      }
    }, 500);
  };
  
  const handleInvite = (user) => {
    toast.success(`Invitation sent to ${user.name}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Search Users</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="relative mb-3">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={searching}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
            </h2>
            
            {searchResults.map(user => (
              <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">@{user.username}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-gray-900">{user.rating}</span>
                      </div>
                      <span className="text-gray-500">{user.deals} deals</span>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <button
                    onClick={() => handleInvite(user)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 text-sm"
                  >
                    Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!searching && searchResults.length === 0 && searchQuery && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try searching for a different name or username</p>
          </div>
        )}
      </div>
    </div>
  );
}
