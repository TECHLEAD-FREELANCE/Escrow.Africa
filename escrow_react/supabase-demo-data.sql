-- =============================================
-- ESCROW.AFRICA - DEMO DATA
-- =============================================
-- Run this SQL AFTER running supabase-schema.sql
-- This creates 3 demo accounts with realistic data
-- =============================================

-- =============================================
-- DEMO USER ACCOUNTS
-- =============================================
-- Creates 3 users with authentication credentials
-- Then manually creates their profiles
-- =============================================

DO $$
DECLARE
  buyer_id UUID;
  seller_id UUID;
  admin_id UUID;
BEGIN
  -- =============================================
  -- Create Buyer Account
  -- =============================================
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'buyer@escrow.africa',
    crypt('buyer123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"John Mutua","username":"buyer1","phone":"+254712345678"}',
    NOW(),
    NOW(),
    '',
    ''
  ) RETURNING id INTO buyer_id;
  
  -- =============================================
  -- Create Seller Account
  -- =============================================
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'seller@escrow.africa',
    crypt('seller123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sarah Kimani","username":"seller1","phone":"+254723456789"}',
    NOW(),
    NOW(),
    '',
    ''
  ) RETURNING id INTO seller_id;
  
  -- =============================================
  -- Create Admin/Freelancer Account
  -- =============================================
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@escrow.africa',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Grace Wanjiku","username":"admin1","phone":"+254734567890"}',
    NOW(),
    NOW(),
    '',
    ''
  ) RETURNING id INTO admin_id;

  -- =============================================
  -- CREATE PROFILES MANUALLY
  -- =============================================
  
  INSERT INTO profiles (id, username, full_name, email, phone, wallet_balance, rating, verified)
  VALUES 
    (buyer_id, 'buyer1', 'John Mutua', 'buyer@escrow.africa', '+254712345678', 0.00, 5.0, TRUE),
    (seller_id, 'seller1', 'Sarah Kimani', 'seller@escrow.africa', '+254723456789', 0.00, 5.0, TRUE),
    (admin_id, 'admin1', 'Grace Wanjiku', 'admin@escrow.africa', '+254734567890', 0.00, 5.0, TRUE);

  -- =============================================
  -- UPDATE PROFILE WALLET BALANCES
  -- =============================================
  
  UPDATE profiles SET 
    wallet_balance = 125000.00,
    completed_deals = 12,
    rating = 4.8
  WHERE id = buyer_id;
  
  UPDATE profiles SET 
    wallet_balance = 85000.00,
    completed_deals = 28,
    rating = 4.9
  WHERE id = seller_id;
  
  UPDATE profiles SET 
    wallet_balance = 50000.00,
    completed_deals = 15,
    rating = 5.0
  WHERE id = admin_id;

  -- =============================================
  -- CREATE SAMPLE DEALS
  -- =============================================
  
  INSERT INTO deals (id, title, description, amount, category, timeline, status, buyer_id, seller_id, created_by, deadline, created_at, updated_at)
  VALUES 
    (
      'ESC001',
      'Website Development Project',
      'Full-stack web application with React frontend and Node.js backend. Includes user authentication, dashboard, and payment integration.',
      50000.00,
      'Services',
      7,
      'in-progress',
      buyer_id,
      seller_id,
      buyer_id,
      NOW() + INTERVAL '5 days',
      NOW() - INTERVAL '2 days',
      NOW()
    ),
    (
      'ESC002',
      'Laptop Purchase - Dell XPS 15',
      'Brand new Dell XPS 15 laptop with Intel i7, 16GB RAM, 512GB SSD. Still under warranty.',
      85000.00,
      'Electronics',
      3,
      'pending-payment',
      buyer_id,
      admin_id,
      buyer_id,
      NOW() + INTERVAL '3 days',
      NOW() - INTERVAL '1 day',
      NOW()
    ),
    (
      'ESC003',
      'Logo Design Services',
      'Professional logo design for new startup. Includes 3 concepts and unlimited revisions.',
      15000.00,
      'Services',
      5,
      'completed',
      admin_id,
      seller_id,
      admin_id,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '7 days',
      NOW() - INTERVAL '2 days'
    ),
    (
      'ESC004',
      'Mobile App Development',
      'Cross-platform mobile app development using React Native. E-commerce functionality.',
      120000.00,
      'Services',
      14,
      'pending-acceptance',
      buyer_id,
      seller_id,
      seller_id,
      NOW() + INTERVAL '14 days',
      NOW(),
      NOW()
    );

  -- =============================================
  -- CREATE SAMPLE TRANSACTIONS
  -- =============================================
  
  INSERT INTO transactions (user_id, deal_id, type, sub_type, description, amount, status, created_at)
  VALUES 
    -- Buyer transactions
    (buyer_id, NULL, 'credit', 'topup', 'Wallet Top-up via M-Pesa', 100000.00, 'completed', NOW() - INTERVAL '10 days'),
    (buyer_id, 'ESC001', 'debit', 'payment', 'Payment for Website Development - ESC001', -50000.00, 'completed', NOW() - INTERVAL '2 days'),
    (buyer_id, NULL, 'credit', 'topup', 'Wallet Top-up via Airtel Money', 75000.00, 'completed', NOW() - INTERVAL '5 days'),
    
    -- Seller transactions
    (seller_id, 'ESC003', 'credit', 'received', 'Payment received for Logo Design - ESC003', 15000.00, 'completed', NOW() - INTERVAL '2 days'),
    (seller_id, NULL, 'debit', 'withdrawal', 'Withdrawal to M-Pesa', -25000.00, 'completed', NOW() - INTERVAL '3 days'),
    (seller_id, NULL, 'credit', 'topup', 'Wallet Top-up via M-Pesa', 50000.00, 'completed', NOW() - INTERVAL '8 days'),
    (seller_id, NULL, 'debit', 'fee', 'Platform Fee - ESC003', -300.00, 'completed', NOW() - INTERVAL '2 days'),
    
    -- Admin transactions
    (admin_id, 'ESC003', 'debit', 'payment', 'Payment for Logo Design - ESC003', -15000.00, 'completed', NOW() - INTERVAL '7 days'),
    (admin_id, NULL, 'credit', 'topup', 'Wallet Top-up via M-Pesa', 50000.00, 'completed', NOW() - INTERVAL '9 days'),
    (admin_id, NULL, 'credit', 'refund', 'Refund for cancelled deal', 5000.00, 'completed', NOW() - INTERVAL '4 days');

  -- =============================================
  -- CREATE SAMPLE MESSAGES
  -- =============================================
  
  INSERT INTO messages (sender_id, receiver_id, deal_id, message, read, created_at)
  VALUES 
    (buyer_id, seller_id, 'ESC001', 'Hi! I am interested in your website development services.', TRUE, NOW() - INTERVAL '2 days'),
    (seller_id, buyer_id, 'ESC001', 'Great! Can you share the project requirements?', TRUE, NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),
    (buyer_id, seller_id, 'ESC001', 'Sure! I need a full-stack web app with React and Node.js.', TRUE, NOW() - INTERVAL '2 days' + INTERVAL '10 minutes'),
    (seller_id, buyer_id, 'ESC001', 'Perfect! I can start immediately once payment is confirmed.', TRUE, NOW() - INTERVAL '2 days' + INTERVAL '15 minutes'),
    (buyer_id, seller_id, 'ESC001', 'Payment confirmed! Looking forward to working with you.', TRUE, NOW() - INTERVAL '2 days' + INTERVAL '20 minutes'),
    (seller_id, buyer_id, 'ESC001', 'The website looks great! Ready to deploy.', FALSE, NOW() - INTERVAL '2 hours'),
    
    (buyer_id, admin_id, 'ESC002', 'Is the laptop still available?', TRUE, NOW() - INTERVAL '1 day'),
    (admin_id, buyer_id, 'ESC002', 'Yes! It is brand new and still under warranty.', TRUE, NOW() - INTERVAL '1 day' + INTERVAL '30 minutes'),
    (buyer_id, admin_id, 'ESC002', 'When can you deliver?', FALSE, NOW() - INTERVAL '1 hour');

  -- =============================================
  -- CREATE SAMPLE DISPUTES
  -- =============================================
  
  INSERT INTO disputes (id, deal_id, raised_by, reason, description, status, created_at, updated_at)
  VALUES 
    (
      'DIS001',
      'ESC004',
      buyer_id,
      'Quality issues',
      'The delivered work does not match the agreed specifications and quality standards.',
      'open',
      NOW() - INTERVAL '1 day',
      NOW()
    );

  -- =============================================
  -- CREATE SAMPLE NOTIFICATIONS
  -- =============================================
  
  INSERT INTO notifications (user_id, title, message, type, read, data, created_at)
  VALUES 
    (buyer_id, 'Payment Successful', 'Your payment of KES 50,000 for ESC001 has been processed.', 'payment', TRUE, '{"deal_id":"ESC001","amount":50000}', NOW() - INTERVAL '2 days'),
    (buyer_id, 'New Message', 'You have a new message from Sarah Kimani about ESC001.', 'message', FALSE, '{"sender":"Sarah Kimani","deal_id":"ESC001"}', NOW() - INTERVAL '2 hours'),
    (buyer_id, 'Deal Update', 'The seller has accepted your deal ESC002.', 'deal', FALSE, '{"deal_id":"ESC002"}', NOW() - INTERVAL '5 hours'),
    
    (seller_id, 'Payment Received', 'You received KES 15,000 for completing ESC003.', 'payment', TRUE, '{"deal_id":"ESC003","amount":15000}', NOW() - INTERVAL '2 days'),
    (seller_id, 'New Deal Request', 'John Mutua invited you to a new deal (ESC004).', 'deal', FALSE, '{"deal_id":"ESC004","buyer":"John Mutua"}', NOW() - INTERVAL '3 hours'),
    
    (admin_id, 'Deal Completed', 'Your deal ESC003 has been marked as completed.', 'deal', TRUE, '{"deal_id":"ESC003"}', NOW() - INTERVAL '2 days'),
    (admin_id, 'Withdrawal Successful', 'Your withdrawal of KES 25,000 has been processed.', 'payment', TRUE, '{"amount":25000}', NOW() - INTERVAL '3 days');

  -- =============================================
  -- DEMO DATA CREATED SUCCESSFULLY
  -- =============================================
  
  RAISE NOTICE '✅ Demo data created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'DEMO ACCOUNTS:';
  RAISE NOTICE '------------------------------------------------';
  RAISE NOTICE '1. Buyer: buyer@escrow.africa / buyer123';
  RAISE NOTICE '   Wallet: KES 125,000 | Deals: 12 | Rating: 4.8★';
  RAISE NOTICE '';
  RAISE NOTICE '2. Seller: seller@escrow.africa / seller123';
  RAISE NOTICE '   Wallet: KES 85,000 | Deals: 28 | Rating: 4.9★';
  RAISE NOTICE '';
  RAISE NOTICE '3. Admin: admin@escrow.africa / admin123';
  RAISE NOTICE '   Wallet: KES 50,000 | Deals: 15 | Rating: 5.0★';
  RAISE NOTICE '------------------------------------------------';
  RAISE NOTICE '';
  RAISE NOTICE 'SAMPLE DATA CREATED:';
  RAISE NOTICE '✅ 4 Deals (various statuses)';
  RAISE NOTICE '✅ 10 Transactions';
  RAISE NOTICE '✅ 9 Messages';
  RAISE NOTICE '✅ 1 Dispute';
  RAISE NOTICE '✅ 7 Notifications';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready to use! Start your app and login with any demo account.';

END $$;
