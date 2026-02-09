-- =============================================
-- ESCROW.AFRICA DATABASE SCHEMA V2
-- =============================================
-- Simple authentication with password column
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILES TABLE (with password column)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
  rating DECIMAL(2, 1) DEFAULT 5.0,
  completed_deals INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DEALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY DEFAULT ('ESC' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  timeline INTEGER NOT NULL, -- days
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending-acceptance' CHECK (
    status IN (
      'pending-acceptance',
      'pending-payment',
      'in-progress',
      'completed',
      'disputed',
      'cancelled'
    )
  ),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  buyer_role TEXT CHECK (buyer_role IN ('buyer', 'seller')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  deal_id TEXT REFERENCES deals(id),
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  sub_type TEXT NOT NULL CHECK (
    sub_type IN (
      'topup',
      'withdrawal',
      'payment',
      'received',
      'refund',
      'fee'
    )
  ),
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (
    status IN ('pending', 'completed', 'failed', 'cancelled')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DISPUTES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY DEFAULT ('DIS' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  deal_id TEXT REFERENCES deals(id) NOT NULL,
  raised_by UUID REFERENCES profiles(id) NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (
    status IN ('open', 'under-review', 'resolved', 'rejected')
  ),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  deal_id TEXT REFERENCES deals(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_deals_buyer ON deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller ON deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_deal ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies (Simple - anyone can do anything)
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (TRUE);

CREATE POLICY "Anyone can delete profiles"
  ON profiles FOR DELETE
  USING (TRUE);

-- Deals policies
CREATE POLICY "Anyone can view deals"
  ON deals FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can create deals"
  ON deals FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can update deals"
  ON deals FOR UPDATE
  USING (TRUE);

-- Transactions policies
CREATE POLICY "Anyone can view transactions"
  ON transactions FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (TRUE);

-- Disputes policies
CREATE POLICY "Anyone can view disputes"
  ON disputes FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (TRUE);

-- Messages policies
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can update messages"
  ON messages FOR UPDATE
  USING (TRUE);

-- Notifications policies
CREATE POLICY "Anyone can view notifications"
  ON notifications FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can update notifications"
  ON notifications FOR UPDATE
  USING (TRUE);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- AUTHENTICATION NOTES
-- =============================================
-- This schema stores passwords in the profiles table
-- 
-- Signup flow:
-- 1. User enters: username, email, password, full_name, phone
-- 2. App does: INSERT INTO profiles (username, email, password, ...) VALUES (...)
-- 
-- Login flow:
-- 1. User enters: email/username and password
-- 2. App does: SELECT * FROM profiles WHERE (email = $1 OR username = $1) AND password = $2
-- 3. If found, log them in
-- 
-- ⚠️ SECURITY NOTE:
-- Passwords are stored as plain text in this simple version
-- For production, you should hash passwords using bcrypt
-- =============================================

-- =============================================
-- DEMO DATA (OPTIONAL)
-- =============================================
-- Insert 3 demo users for testing:

INSERT INTO profiles (username, email, password, full_name, phone, wallet_balance, rating, completed_deals, verified)
VALUES 
  ('buyer1', 'buyer@escrow.africa', 'buyer123', 'John Mutua', '+254712345678', 125000.00, 4.8, 12, TRUE),
  ('seller1', 'seller@escrow.africa', 'seller123', 'Sarah Kimani', '+254723456789', 85000.00, 4.9, 28, TRUE),
  ('admin1', 'admin@escrow.africa', 'admin123', 'Grace Wanjiku', '+254734567890', 50000.00, 5.0, 15, TRUE);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if all tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- View demo users:
-- SELECT username, email, full_name, wallet_balance FROM profiles;

-- =============================================
-- SETUP COMPLETE
-- =============================================
-- ✅ All 6 tables created (profiles with password column)
-- ✅ RLS policies enabled (simple - anyone can access)
-- ✅ Indexes created for fast queries
-- ✅ Timestamp update triggers configured
-- ✅ 3 demo users inserted
-- 
-- Demo Accounts:
-- - buyer@escrow.africa / buyer123
-- - seller@escrow.africa / seller123
-- - admin@escrow.africa / admin123
-- 
-- Next steps:
-- 1. Go to your app and update authentication code
-- 2. Login flow: Check email/password against profiles table
-- 3. Signup flow: Insert into profiles table with password
-- 4. Start your app: npm run dev
-- 5. Test login with demo accounts above
-- =============================================
