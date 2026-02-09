# Quick Setup Guide for Escrow.Africa

## 🎯 Quick Start (5 minutes)

Follow these steps to get your app running:

### Step 1: Install Dependencies ✅
```bash
npm install
```

### Step 2: Create Supabase Project ✅

1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Enter:
   - Name: `Escrow.Africa`
   - Database Password: (save this!)
   - Region: (choose nearest)
4. Click **"Create new project"**
5. Wait 2-3 minutes for it to initialize

### Step 3: Get API Keys ✅

1. In Supabase, go to **Settings** (⚙️) → **API**
2. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long key)

### Step 4: Configure Environment ✅

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Open `.env` and paste your keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

### Step 5: Set Up Database ✅

#### Part A: Run Schema (Required)

1. In Supabase, go to **SQL Editor** (📝)
2. Click **"New Query"**
3. Open `supabase-schema.sql` from this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or Ctrl+Enter)
7. You should see: ✅ Success. No rows returned

#### Part B: Add Demo Data (Optional)

1. Click **"New Query"** again
2. Open `supabase-demo-data.sql` from this project
3. Copy ALL the SQL code
4. Paste into Supabase SQL Editor
5. Click **Run**
6. This creates 3 demo accounts with sample data!

### Step 6: Configure Auth Settings ✅

1. Go to **Authentication** (👤) → **Settings**
2. Scroll to **Email Auth**
3. Toggle OFF **"Enable email confirmations"** (for testing)
4. Click **Save**

### Step 7: Start the App 🚀

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Step 9: Login with Demo Account ✅

The schema created 3 demo accounts with sample data:

**🛒 Buyer Account:**
- Email: `buyer@escrow.africa`
- Password: `buyer123`
- Wallet: KES 125,000
- Has active deals and transaction history

**🏪 Seller Account:**
- Email: `seller@escrow.africa`
- Password: `seller123`
- Wallet: KES 85,000
- 28 completed deals, 4.9★ rating

**👑 Admin Account:**
- Email: `admin@escrow.africa`
- Password: `admin123`
- Wallet: KES 50,000
- 15 completed deals, 5.0★ rating

1. Click **"Sign In"**
2. Use any of the demo accounts above
3. Explore the dashboard with real data! 🎉

**Or create your own account:**
1. Click **"Sign Up"**
2. Fill in the form
3. Complete OTP verification
4. Your profile will be created automatically!

---

## ✅ Verification Checklist

Check if everything works:

- [ ] App loads without errors
- [ ] Can sign up successfully
- [ ] Auto-redirected to dashboard
- [ ] Can see wallet balance
- [ ] Can navigate between pages
- [ ] Bottom navigation works

---

## 🐛 Common Issues

### Issue: "Invalid Supabase credentials"

**Fix**:
1. Check `.env` file exists in project root
2. Verify keys are correct (no extra spaces)
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Issue: "Failed to create profile"

**Fix**:
1. Go to Supabase → **Table Editor**
2. Check if `profiles` table exists
3. If not, re-run `supabase-schema.sql`

### Issue: Can't see demo account data

**Fix**:
1. Ensure the entire `supabase-schema.sql` ran successfully
2. Check Supabase → **Table Editor** → `profiles`
3. Verify 3 demo users exist (buyer1, seller1, admin1)
4. If missing, re-run the schema (it will create them)

---

## 🎨 What's Next?

Now you can **login immediately** with demo accounts and explore:

**Recommended: Start with Buyer Account**
- Login: `buyer@escrow.africa` / `buyer123`
- See: Active deals, wallet balance, transaction history
- Try: Creating a new deal, topping up wallet

**Then try Seller Account**
- Login: `seller@escrow.africa` / `seller123`
- See: Incoming deal requests, earnings, completed deals
- Try: Accepting deals, withdrawing funds

**Features to Explore:**

1. **Dashboard**
   - View wallet balance (KES 125,000 for buyer)
   - See quick action buttons
   - Check notifications (3 unread)

2. **Deals**
   - View active deals (ESC001: Website Dev)
   - See pending deals (ESC002: Laptop)
   - Check completed deals (ESC003: Logo Design)
   - Create new deals with the **+** button

3. **Wallet**
   - Top-up with simulated M-Pesa/Airtel
   - Withdraw funds (with fee calculation)
   - View transaction history

4. **Chat**
   - Open existing conversations
   - Send messages (auto-replies enabled)
   - See typing indicators

5. **Other Features**
   - Search users
   - View disputes (1 open dispute)
   - Check transaction history
   - Manage profile

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Review Supabase logs: **Project Settings** → **Logs**
3. Ensure all SQL ran successfully in Step 5

---

**🎉 Congratulations! Your Escrow.Africa app is running!**
