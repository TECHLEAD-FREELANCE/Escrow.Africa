# Escrow.Africa - React + Supabase Setup Guide

## 🚀 Overview

Escrow.Africa is a secure escrow payment platform built with React, Vite, Tailwind CSS, and Supabase. This guide will help you set up the complete application with database integration.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works)

## 🛠️ Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### A. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Escrow.Africa
   - **Database Password**: (Choose a strong password)
   - **Region**: (Select closest to your users)
4. Wait for the project to be created (2-3 minutes)

#### B. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbG...`)

#### C. Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Schema

#### A. Open SQL Editor

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**

#### B. Run the Schema

1. Open `supabase-schema.sql` from this project
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

This will create:
- ✅ `profiles` table (user information)
- ✅ `deals` table (escrow transactions)
- ✅ `transactions` table (wallet transactions)
- ✅ `disputes` table (dispute management)
- ✅ `messages` table (chat system)
- ✅ `notifications` table (user notifications)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for auto-updates

#### C. Add Demo Data (Optional)

1. Click **New Query** again
2. Open `supabase-demo-data.sql`
3. Copy all the SQL code
4. Paste and click **Run**

This creates:
- 👤 3 demo accounts (buyer, seller, admin)
- 📦 4 sample deals with various statuses
- 💰 10 sample transactions
- 💬 9 messages, 🔔 7 notifications, ⚠️ 1 dispute

### 4. Configure Authentication

#### A. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled

#### B. Disable Email Confirmation (for testing)

1. Go to **Authentication** → **Settings**
2. Find **Email Confirmation**
3. Toggle OFF "Enable email confirmations"
4. Click **Save**

> **Note**: For production, keep email confirmation ON for security

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Create Your First Account

1. Click **Sign Up**
2. Fill in the registration form
3. Complete the simulated OTP verification
4. You'll be redirected to the dashboard

**OR use a demo account with sample data:**

```
Buyer:  buyer@escrow.africa / buyer123
Seller: seller@escrow.africa / seller123
Admin:  admin@escrow.africa / admin123
```

Demo accounts include:
- Pre-loaded wallet balances
- Sample deals (active, completed, pending)
- Transaction history
- Messages and notifications
- Completed profiles with ratings

## 🎨 Features

### ✅ Implemented

- **Authentication**: Email/password signup and login with Supabase
- **Dashboard**: Wallet balance, quick actions, notifications
- **Deal Management**: Create, view, accept, pay, complete deals
- **Wallet**: Top-up, withdraw, transaction history
- **Chat System**: Real-time messaging with auto-replies
- **Disputes**: Raise and track disputes
- **User Search**: Find and invite users
- **Profile**: Edit user information

### 🔄 Simulated Features

- OTP verification (auto-fills after 2s)
- Payment processing (shows loading animation)
- Chat responses (automated replies)
- M-Pesa/Airtel payment integration

## 📁 Project Structure

```
escrow_react/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/              # Page components
│   ├── stores/             # Zustand state management
│   ├── lib/                # Supabase client & helpers
│   └── assets/             # Images and icons
├── supabase-schema.sql     # Database schema
├── supabase-demo-data.sql  # Demo accounts & sample data
├── .env.example            # Environment template
└── README.md              # This file
```

## 🔧 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## 🐛 Troubleshooting

### "Invalid API credentials"
- Check `.env` file has correct Supabase values
- Restart dev server after changing `.env`

### "Failed to create profile"
- Ensure `supabase-schema.sql` was run in Supabase SQL Editor
- Check tables exist in Table Editor

### "CORS error"
- Add `http://localhost:5173` to allowed origins in Supabase
- Go to Authentication → URL Configuration

## 🚢 Deployment

### Vercel / Netlify

1. Push to GitHub
2. Import project
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

---

**Built with ❤️ using React, Vite, Tailwind CSS, and Supabase**

