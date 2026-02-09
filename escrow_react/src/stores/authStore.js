import { create } from 'zustand';
import { simpleLogin, simpleSignup } from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem('currentUser')) || null,
  loading: false,
  
  login: async (emailOrUsername, password) => {
    try {
      set({ loading: true });
      
      // Simple login - query profiles table directly
      const profile = await simpleLogin(emailOrUsername, password);
      
      const userData = {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        username: profile.username,
        phone: profile.phone,
        walletBalance: parseFloat(profile.wallet_balance),
        rating: parseFloat(profile.rating),
        completedDeals: profile.completed_deals,
        verified: profile.verified,
        avatar: profile.avatar,
      };
      
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      set({ user: userData, loading: false });
      
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },
  
  signup: async (signupData) => {
    try {
      set({ loading: true });
      
      // Simple signup - insert into profiles table directly
      const profile = await simpleSignup(signupData);
      
      set({ loading: false });
      return { success: true, profile };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },
  
  logout: async () => {
    sessionStorage.removeItem('currentUser');
    set({ user: null });
  },
  
  updateUser: (updates) => {
    set((state) => {
      const updatedUser = { ...state.user, ...updates };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));

export default useAuthStore;
