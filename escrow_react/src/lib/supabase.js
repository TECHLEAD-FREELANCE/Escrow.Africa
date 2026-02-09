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
