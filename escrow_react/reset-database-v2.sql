-- =============================================
-- RESET DATABASE - DROP EVERYTHING
-- =============================================
-- ⚠️ WARNING: This will DELETE ALL DATA
-- Run this to completely reset your database
-- =============================================

-- Drop all policies first
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view deals" ON deals;
DROP POLICY IF EXISTS "Anyone can create deals" ON deals;
DROP POLICY IF EXISTS "Anyone can update deals" ON deals;
DROP POLICY IF EXISTS "Anyone can view transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can create transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can view disputes" ON disputes;
DROP POLICY IF EXISTS "Anyone can create disputes" ON disputes;
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
DROP POLICY IF EXISTS "Anyone can send messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can update notifications" ON notifications;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
DROP TRIGGER IF EXISTS update_disputes_updated_at ON disputes;

-- Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop all tables (CASCADE removes dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =============================================
-- RESET COMPLETE
-- =============================================
-- All tables, policies, triggers, and functions have been removed
-- 
-- Next steps:
-- 1. Run supabase-schema-v2.sql to recreate tables
-- 2. Use app to sign up (creates profile with password)
-- 3. Login checks email/password directly in profiles table
-- =============================================
