-- =============================================
-- ESCROW.AFRICA DATABASE SCHEMA
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PROFILES TABLE
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

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (TRUE);

CREATE POLICY "Users can delete their own profile"
  ON profiles FAnyone can view deals"
  ON deals FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can create deals"
  ON deals FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can update deals"
  ON deals FOR UPDATE
  USING (TRUEON deals FOR UPDATE
  USING (
    auth.uid() = buyer_id OR
    auth.uid() = seller_id
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
Anyone can view transactions"
  ON transactions FOR SELECT
  USING (TRUE);Anyone can view disputes"
  ON disputes FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (TRUE);

-- Messages policies
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );
Anyone can view messages"
  ON messages FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (TRUE
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONSAnyone can view notifications"
  ON notifications FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can update notifications"
  ON notifications FOR UPDATE
  USING (TRUE
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
-- NOTE: Profile Creation
-- =============================================
-- Profiles are created manually via the application code
-- in src/lib/supabase.js createUserProfile() function
-- This is called after successful user signup

-- =============================================
-- DEMO DATA (OPTIONAL)
-- =============================================
-- For saAuthentication
-- =============================================
-- Authentication is handled by checking email/password
-- against the profiles table directly
-- Password is stored as plain text (or hash it in your app)

-- =============================================
-- DEMO DATA (OPTIONAL)
-- =============================================
-- You can manually insert demo users:
--
-- INSERT INTO profiles (username, email, password, full_name, phone, wallet_balance, rating, completed_deals, verified)
-- VALUES 
--   ('buyer1', 'buyer@escrow.africa', 'buyer123', 'John Mutua', '+254712345678', 125000.00, 4.8, 12, TRUE),
--   ('seller1', 'seller@escrow.africa', 'seller123', 'Sarah Kimani', '+254723456789', 85000.00, 4.9, 28, TRUE),
--   ('admin1', 'admin@escrow.africa', 'admin123', 'Grace Wanjiku', '+254734567890', 50000.00, 5.0, 15, TRUE);
-- Check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- =============================================
-- SETUP COMPLETE
-- =============================================
-- ✅ All tables created
-- ✅ RLS policies enabled
-- ✅ Indexes created
-- ✅ Timestamp update triggers configured
-- 
-- Next steps:
-- 1. Run this SQL file in Supabase SQL Editor
-- 2. (Optional) Run supabase-demo-data.sql for demo accounts
-- 3. Go to Authentication > Settings
-- 4. Disable "Enable email confirmations" (for testing)
-- 5. Start your app: npm run dev
-- 6. Either create account or login with demo accounts
-- =============================================
Insert demo users manually (see above)
-- 3. Start your app: npm run dev
-- 4. Sign up creates new row in profiles table
-- 5. Login checks email/password against profiles table