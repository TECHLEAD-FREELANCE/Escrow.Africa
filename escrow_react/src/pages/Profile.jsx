import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Bell, Lock, LogOut, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+254712345678',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
    setEditing(false);
  };
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };
  
  const menuItems = [
    { icon: Bell, label: 'Notifications', action: () => toast.info('Notifications settings') },
    { icon: Shield, label: 'Privacy & Security', action: () => toast.info('Privacy settings') },
    { icon: Lock, label: 'Change Password', action: () => toast.info('Change password') },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-400 p-6 pb-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-teal-600 text-3xl font-bold mx-auto mb-4 shadow-lg">
            {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{user?.fullName || 'User'}</h1>
          <p className="text-teal-100 text-sm mb-4">@{user?.username || 'username'}</p>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-semibold">{user?.rating || 5.0}</span>
            <span className="text-teal-100 text-sm">• {user?.completedDeals || 0} deals</span>
          </div>
          
          {user?.verified && (
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
              <Shield className="w-4 h-4" />
              <span>Verified User</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 -mt-6 space-y-4">
        {/* Edit Profile */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Profile Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm text-teal-600 font-medium hover:text-teal-700"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-200 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        
        <p className="text-center text-sm text-gray-500 py-4">
          Version 1.0.0 • © 2026 Escrow.Africa
        </p>
      </div>
    </div>
  );
}
