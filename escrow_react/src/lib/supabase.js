import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions

// Simple Signup - Direct DB insert (no Supabase Auth)
export const simpleSignup = async (signupData) => {
  // Check if username or email already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('username, email')
    .or(`username.eq.${signupData.username},email.eq.${signupData.email}`);

  if (existing && existing.length > 0) {
    if (existing[0].username === signupData.username) {
      throw new Error('Username already taken');
    }
    if (existing[0].email === signupData.email) {
      throw new Error('Email already registered');
    }
  }

  // Insert new user
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        full_name: signupData.fullName,
        phone: signupData.phone,
        wallet_balance: 0,
        rating: 5.0,
        completed_deals: 0,
        verified: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Simple Login - Direct DB query (no Supabase Auth)
export const simpleLogin = async (emailOrUsername, password) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('Invalid email/username or password');
  }

  return data;
};

// Get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get user by username
export const getUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
};

// Create deal
export const createDeal = async (dealData) => {
  const { data, error } = await supabase
    .from('deals')
    .insert([dealData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get user deals
export const getUserDeals = async (userId) => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Get deal by ID
export const getDealById = async (dealId) => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', dealId)
    .single();

  if (error) throw error;
  return data;
};

// Update deal status
export const updateDealStatus = async (dealId, status) => {
  const { data, error } = await supabase
    .from('deals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', dealId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Create transaction
export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get user transactions
export const getUserTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Get all deals (for search/browse)
export const getAllDeals = async () => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Search deals
export const searchDeals = async (searchTerm) => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get messages for a conversation
export const getMessages = async (userId, otherUserId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Send message
export const sendMessage = async (messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get user conversations (unique users they've chatted with)
export const getUserConversations = async (userId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('sender_id, receiver_id, created_at')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get unique user IDs
  const userIds = new Set();
  data?.forEach((msg) => {
    if (msg.sender_id !== userId) userIds.add(msg.sender_id);
    if (msg.receiver_id !== userId) userIds.add(msg.receiver_id);
  });

  // Fetch profiles for these users
  if (userIds.size === 0) return [];

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', Array.from(userIds));

  if (profileError) throw profileError;
  return profiles || [];
};

// Get user disputes
export const getUserDisputes = async (userId) => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*, deals(*)')
    .eq('raised_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Create dispute
export const createDispute = async (disputeData) => {
  const { data, error } = await supabase
    .from('disputes')
    .insert([disputeData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update dispute status
export const updateDisputeStatus = async (disputeId, status, resolution = null) => {
  const updates = { status, updated_at: new Date().toISOString() };
  if (resolution) {
    updates.resolution = resolution;
    updates.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('disputes')
    .update(updates)
    .eq('id', disputeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get user notifications
export const getUserNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Create notification
export const createNotification = async (notificationData) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update wallet balance
export const updateWalletBalance = async (userId, amount) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ wallet_balance: amount })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get all profiles (for search)
export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar, rating, completed_deals, verified')
    .order('username', { ascending: true });

  if (error) throw error;
  return data || [];
};
