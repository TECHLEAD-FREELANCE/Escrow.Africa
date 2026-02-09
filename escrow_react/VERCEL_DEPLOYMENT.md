# 🚀 Escrow.Africa - Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - For connecting Vercel to your repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project** - Already configured at `https://aiupuywlgwxntozzeutw.supabase.co`

## 🗄️ Database Setup (Do This FIRST!)

### Step 1: Reset Database
1. Go to your Supabase project: https://aiupuywlgwxntozzeutw.supabase.co
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `reset-database-v2.sql`
4. Click **Run** to drop all existing tables and policies

### Step 2: Create New Schema
1. In the same **SQL Editor**
2. Copy and paste the contents of `supabase-schema-v2.sql`
3. Click **Run** to create all tables with the new password-based auth
4. This will also insert 3 demo users:
   - `buyer@escrow.africa` / `buyer123`
   - `seller@escrow.africa` / `seller123`
   - `admin@escrow.africa` / `admin123`

### Step 3: Verify Database
Run this query to check tables were created:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

You should see: `profiles`, `deals`, `transactions`, `disputes`, `messages`, `notifications`

## 🔧 Local Development Setup

### 1. Install Dependencies
```bash
cd "c:\IMPORTANT\FREELANCE\Escrow.Africe [ Prototype ]\escrow_react"
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root (already exists):
```env
VITE_SUPABASE_URL=https://aiupuywlgwxntozzeutw.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get your anon key from:
- Supabase Dashboard → Settings → API → `anon` `public` key

### 3. Run Development Server
```bash
npm run dev
```

Access at: http://localhost:5173

### 4. Test Authentication
- **Sign Up**: Create a new account (no rate limits now!)
- **Login**: Use demo account: `buyer@escrow.africa` / `buyer123`

## ☁️ Vercel Deployment

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
cd "c:\IMPORTANT\FREELANCE\Escrow.Africe [ Prototype ]\escrow_react"
git init
git add .
git commit -m "Initial commit - Escrow.Africa with simple auth"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/escrow-africa.git
git branch -M main
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Vercel will auto-detect Vite framework

#### Step 3: Configure Environment Variables
In the Vercel deployment settings, add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://aiupuywlgwxntozzeutw.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your anon key from Supabase |

#### Step 4: Deploy
1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Or deploy to production directly
vercel --prod
```

## 🔐 Environment Variables Setup in Vercel

After deployment, go to:
**Project Settings** → **Environment Variables**

Add these variables:
```
VITE_SUPABASE_URL=https://aiupuywlgwxntozzeutw.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

**Important:** Redeploy after adding environment variables:
- Go to **Deployments** tab
- Click the **3 dots** on the latest deployment
- Click **Redeploy**

## ✅ Post-Deployment Checklist

### 1. Test Authentication
- [ ] Visit your Vercel URL
- [ ] Sign up with a new account
- [ ] Login with demo account: `buyer@escrow.africa` / `buyer123`
- [ ] Logout and login again

### 2. Test Core Features
- [ ] **Dashboard**: View wallet balance and stats
- [ ] **Deals**: Create a new deal
- [ ] **Wallet**: Check balance, view transactions
- [ ] **Search**: Search for deals or users
- [ ] **Profile**: View and update profile

### 3. Test Data Flow
- [ ] Create a deal
- [ ] Accept a deal (use another demo account)
- [ ] Send a message
- [ ] View transaction history

## 🐛 Troubleshooting

### Build Fails on Vercel
**Problem**: Build errors or missing dependencies
**Solution**: 
```bash
# Locally test the build
npm run build

# If it works locally, redeploy on Vercel
```

### Blank Page After Deployment
**Problem**: Environment variables not set
**Solution**:
1. Check environment variables are added in Vercel
2. Ensure they start with `VITE_` prefix
3. Redeploy after adding variables

### 401/403 Errors in Production
**Problem**: Supabase RLS policies blocking requests
**Solution**:
1. All policies should be set to `USING (TRUE)` (already done in schema v2)
2. Re-run `supabase-schema-v2.sql` if needed

### Login/Signup Not Working
**Problem**: Database queries failing
**Solution**:
1. Verify database was set up correctly:
   ```sql
   SELECT * FROM profiles LIMIT 1;
   ```
2. Check browser console for errors
3. Verify environment variables match Supabase credentials

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel
1. Go to **Project Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `escrow.africa` or `app.escrow.africa`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### DNS Records
Add these records in your domain registrar:

**For apex domain (escrow.africa):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (app.escrow.africa):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

## 📊 Monitoring & Analytics

### Enable Vercel Analytics
1. Go to **Project Settings** → **Analytics**
2. Click **Enable Analytics**
3. View traffic and performance metrics

### Check Logs
- Go to **Deployments** → Click on a deployment
- View **Build Logs** or **Function Logs**

## 🔄 Continuous Deployment

Every push to `main` branch will automatically deploy to Vercel:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
```

## 📱 Progressive Web App (Optional)

To make the app installable on mobile:

1. Add this to `vite.config.js`:
```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Escrow.Africa',
        short_name: 'Escrow',
        description: 'Secure payment protection platform',
        theme_color: '#0d9488',
        icons: [/* icon config */]
      }
    })
  ]
});
```

2. Install plugin: `npm install vite-plugin-pwa`
3. Redeploy

## 🎉 You're Live!

Your Escrow.Africa application is now deployed and accessible worldwide!

**Demo Accounts:**
- Buyer: `buyer@escrow.africa` / `buyer123`
- Seller: `seller@escrow.africa` / `seller123`
- Admin: `admin@escrow.africa` / `admin123`

**Share your live URL**: `https://your-project.vercel.app`

## 📞 Support

For issues or questions:
- Check Vercel logs for deployment errors
- Check browser console for frontend errors
- Check Supabase logs for database errors
- Review this documentation

---

**Built with**: React 19 + Vite + TailwindCSS 4 + Supabase + Vercel ✨
