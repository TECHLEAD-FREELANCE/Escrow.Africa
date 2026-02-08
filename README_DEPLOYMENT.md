# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- Project name? (press Enter to use default or type a name)
- In which directory is your code located? **./

**

### 3. Deploy to Production
```bash
vercel --prod
```

## Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub, GitLab, or Bitbucket
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect settings
6. Click "Deploy"

## Important Notes

### ⚠️ Data Persistence Issue
The original `save-user.php` file writes data to JSON files, which **won't work** on Vercel's serverless environment (read-only filesystem).

**Solutions for production:**

1. **Vercel KV (Redis)** - Recommended for simple key-value storage
   ```bash
   # Install Vercel KV
   npm install @vercel/kv
   ```

2. **Vercel Postgres** - For relational data
   ```bash
   npm install @vercel/postgres
   ```

3. **External Database**
   - MongoDB Atlas
   - Firebase Firestore
   - Supabase
   - PlanetScale

### Current Setup
- `/api/save-user.js` replaces `save-user.php`
- It accepts POST requests but doesn't persist data
- Returns success response for testing
- **Must implement proper database for production**

## Environment Variables
If you add a database, set environment variables in Vercel:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add your database credentials

## Custom Domain
After deployment, you can add a custom domain:
1. Go to Project Settings
2. Navigate to Domains
3. Add your domain and follow DNS instructions

## File Structure
```
/
├── index.html          # Landing/login page
├── pages/             # Application pages
├── js/                # JavaScript files
├── css/               # Stylesheets
├── data/              # JSON data files (local dev only)
├── api/               # Serverless functions
│   └── save-user.js   # User save endpoint
├── vercel.json        # Vercel configuration
└── package.json       # Project dependencies
```

## Testing Locally
```bash
vercel dev
```
This runs your project locally with serverless functions.

## Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
