# Fix Supabase Connection - Project Not Found

## Issue
The `.env` file references a project (`ulxvwwowsepgykayglvn`) that doesn't exist in your Supabase dashboard.

## Solution Options

### Option 1: Use Your Existing Paused Project (Quickest)

From your screenshot, you have a paused project. Let's unpause it and get the correct credentials.

**Steps:**
1. Click on your existing project in the dashboard
2. Click "Restore project" or "Unpause" button
3. Once active, go to **Settings** (⚙️ icon in sidebar) → **API**
4. Copy these values:

**You'll need:**
- **Project URL**: Look for `https://[PROJECT_REF].supabase.co`
- **Project Reference ID**: The part before `.supabase.co`
- **anon public key**: Under "Project API keys" → `anon` `public`

5. Update your `.env` file with the correct values (see below)

### Option 2: Create a New Project (Fresh Start)

**Steps:**
1. In Supabase Dashboard, click **"+ New project"** (green button top-right)
2. Fill in:
   - **Name**: `Rubric Evaluator` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Free
3. Click **Create new project**
4. Wait 2-3 minutes for setup to complete
5. Once ready, go to **Settings** → **API**
6. Copy the credentials (see below)

---

## Update Your .env File

Once you have your project credentials, update `.env`:

```bash
# Replace these with YOUR actual project values from Supabase Dashboard → Settings → API

VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_REF"
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_PUBLIC_KEY"
```

**Example (with fake values):**
```bash
VITE_SUPABASE_PROJECT_ID="abcdefghijklmnop"
VITE_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## After Updating .env

### Step 1: Restart Your Dev Server
```powershell
# Stop the current dev server (Ctrl+C in terminal)
npm run dev
```

### Step 2: Apply Database Migrations

**Via Dashboard (Recommended):**
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"+ New query"**
3. Copy the entire contents of:
   `supabase/migrations/20251013183058_b2253462-8310-4d46-8d6e-a59641a300d9.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

This creates all the tables:
- ✅ profiles
- ✅ rubrics
- ✅ submissions  
- ✅ evaluations

### Step 3: Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (toggle should be ON)
3. Optional: Configure email templates under **Email Templates**

### Step 4: Create Storage Bucket
1. Go to **Storage** in sidebar
2. Click **Create a new bucket**
3. Name: `submissions`
4. Public bucket: **Yes** (or set up policies)
5. Click **Create bucket**

### Step 5: Test Your Connection
1. Visit http://localhost:8080/
2. Open Browser Console (F12)
3. Check for Supabase connection test results
4. Try signing up at http://localhost:8080/auth

---

## Verify Everything Works

After setup, test each feature:

✅ **Auth**: Sign up at `/auth` → Check **Authentication** → **Users** in dashboard
✅ **Database**: User profile should auto-create in `profiles` table
✅ **Storage**: Try uploading a file (will test the bucket)

---

## Quick Reference - Where to Find Credentials

**In Supabase Dashboard:**
1. Click your project
2. Click **Settings** (⚙️) in left sidebar
3. Click **API**
4. Look for:
   - **Project URL** → use for `VITE_SUPABASE_URL`
   - **Project ID** → use for `VITE_SUPABASE_PROJECT_ID`
   - **anon public** key → use for `VITE_SUPABASE_PUBLISHABLE_KEY`

**Screenshot example:**
```
Project URL: https://abcdef.supabase.co
             └────┬────┘
              This is your Project ID
```

---

## Need Help?

If you get stuck:
1. Make sure your project is **Active** (not paused)
2. Double-check the `.env` file has no typos
3. Restart dev server after changing `.env`
4. Check browser console for connection errors
5. Verify Authentication → Email provider is enabled

**Common Errors:**
- "Invalid API key" → Wrong anon key in `.env`
- "relation does not exist" → Migrations not applied
- "Failed to fetch" → Wrong project URL or project paused

---

Once you've updated `.env` with correct credentials and applied migrations, your backend will be fully functional! 🚀
